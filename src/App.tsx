import React, { useEffect, useRef, useState } from 'react';
import TreeView from './TreeView';
import { useAppStore } from './store';
import { sampleTree } from './sampleTree';
import DraggableGutter from './DraggableGutter';
import LiveRender from './LiveRender';
import CssInspector from './CssInspector';
import DomCssSync from './DomCssSync';
import TagSelectorModal from './TagSelectorModal';

function addElementToTree(tree, parentId, newNode, position = 'child') {
  // Recursively add newNode to tree
  return tree.map(node => {
    if (node.id === parentId) {
      if (position === 'child') {
        return { ...node, children: [...node.children, newNode] };
      }
      // For before/after, would need parent context
    }
    return { ...node, children: addElementToTree(node.children, parentId, newNode, position) };
  });
}

export default function App() {
  const setTreeData = useAppStore(s => s.setTreeData);
  const paneSizes = useAppStore(s => s.paneSizes);
  const setPaneSizes = useAppStore(s => s.setPaneSizes);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const selectedNodeId = useAppStore(s => s.selectedNodeId);
  const treeData = useAppStore(s => s.treeData);
  const [darkMode, setDarkMode] = useState(() => {
    return window.localStorage.getItem('theme') === 'dark';
  });

  // Load sample data
  useEffect(() => {
    setTreeData(sampleTree);
  }, [setTreeData]);

  // Persist pane sizes
  useEffect(() => {
    localStorage.setItem('paneSizes', JSON.stringify(paneSizes));
  }, [paneSizes]);

  // Load pane sizes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('paneSizes');
    if (saved) setPaneSizes(JSON.parse(saved));
  }, [setPaneSizes]);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    window.localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  // Only the HTML pane is resizable, CSS pane is fixed at 450px, live render is flex-1
  const handleDrag = (delta: number) => {
    let [a] = paneSizes;
    a = Math.max(200, Math.min(window.innerWidth - 450 - 200, a + delta));
    setPaneSizes([a, 0, 0]); // Only first value matters now
  };

  function handleAddElement({ tag, idAttr, classes }) {
    const newNode = {
      id: Date.now().toString(),
      tag,
      idAttr: idAttr || undefined,
      classes,
      children: [],
    };
    if (selectedNodeId) {
      setTreeData(addElementToTree(treeData, selectedNodeId, newNode));
    } else {
      setTreeData([...treeData, newNode]);
    }
    setShowAddModal(false);
  }

  function handleStartNew() {
    setTreeData([
      {
        id: 'root',
        tag: 'div',
        classes: ['container'],
        children: [
          { id: 'child', tag: 'p', classes: [], children: [], idAttr: undefined }
        ],
        idAttr: undefined
      }
    ]);
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--bg-surface)]" style={{ height: '100vh' }}>
      {/* Main App Layout */}
      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden" ref={containerRef}>
        <DomCssSync />
        {/* Left Pane: HTML Tree/Code View (resizable) */}
        <aside 
          style={{ 
            width: paneSizes[0], 
            minWidth: 200, 
            maxWidth: window.innerWidth - 500 - 200 
          }} 
          className="figma-pane flex flex-col h-full overflow-hidden border-r-0 rounded-r-none"
        >
          <TreeView darkMode={darkMode} setDarkMode={setDarkMode} onStartNew={handleStartNew} />
        </aside>
        <DraggableGutter onDrag={handleDrag} index={0} />
        {/* Middle Pane: Live Render (flex-1) */}
        <main className="figma-pane flex-1 flex flex-col h-full overflow-hidden border-l-0 border-r-0 rounded-none">
          <div className="figma-header border-l border-[var(--border-default)]">Live Render</div>
          <LiveRender />
        </main>        {/* Right Pane: CSS Inspector (fixed 450px) */}
        <aside 
          style={{ width: 450, minWidth: 450, maxWidth: 450 }} 
          className="figma-pane flex flex-col h-full overflow-hidden border-l-0 rounded-l-none"
        >
          <div className="figma-header border-l border-[var(--border-default)]">Properties</div>
          <CssInspector />
        </aside>
        {showAddModal && <TagSelectorModal onAdd={handleAddElement} onClose={() => setShowAddModal(false)} />}
      </div>
    </div>
  );
}
