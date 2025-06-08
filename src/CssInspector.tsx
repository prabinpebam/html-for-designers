import React, { useState, useEffect } from 'react';
import { useAppStore } from './store';
import MonacoEditor from '@monaco-editor/react';

// Dummy CSS property groups for modal
const cssGroups = [
  { group: 'Layout', properties: ['display', 'position', 'margin', 'padding'] },
  { group: 'Typography', properties: ['font-size', 'font-weight', 'color'] },
  { group: 'Color', properties: ['background-color', 'color', 'border-color'] },
  { group: 'Effects', properties: ['box-shadow', 'opacity'] },
];

function PropertyModal({ onSelect, onClose }) {
  const [selectedGroup, setSelectedGroup] = useState(cssGroups[0].group);
  const currentGroup = cssGroups.find(g => g.group === selectedGroup) || cssGroups[0];
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md shadow-lg p-4 min-w-[300px]">
        <div className="flex gap-2 mb-3">
          {cssGroups.map(g => (
            <button 
              key={g.group} 
              className={`figma-btn ${selectedGroup === g.group ? 'active' : ''}`} 
              onClick={() => setSelectedGroup(g.group)}
            >
              {g.group}
            </button>
          ))}
        </div>
        <ul className="mb-4">
          {currentGroup.properties.map(prop => (
            <li 
              key={prop} 
              className="py-1.5 px-2 cursor-pointer hover:bg-[var(--bg-hover)] rounded-sm text-[var(--text-primary)] text-sm flex items-center justify-between" 
              onClick={() => onSelect(prop)}
            >
              {prop}
              <span className="text-[var(--text-secondary)]">+</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <button className="figma-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function ValuePicker({ property, onPick, onClose }) {
  // Dummy values for demo
  const values = property === 'color' || property === 'background-color'
    ? ['#000', '#fff', 'red', 'blue', 'green']
    : property === 'font-size'
    ? ['12px', '16px', '24px', '2em']
    : property === 'display'
    ? ['block', 'inline', 'flex', 'grid']
    : ['inherit', 'initial', 'unset'];
    
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md shadow-lg p-4 min-w-[200px]">
        <div className="mb-2 font-semibold flex items-center justify-between">
          <span>{property}</span>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={onClose}>&times;</button>
        </div>
        <div className="figma-divider"></div>
        <ul className="mb-4 mt-2">
          {values.map(val => (
            <li 
              key={val} 
              className="py-1.5 px-2 cursor-pointer hover:bg-[var(--bg-hover)] rounded-sm text-[var(--text-primary)] text-sm" 
              onClick={() => onPick(val)}
            >
              {val}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CssInspector() {
  const selectedNodeId = useAppStore(s => s.selectedNodeId);
  const treeData = useAppStore(s => s.treeData);
  const setTreeData = useAppStore(s => s.setTreeData);
  const cssRules = useAppStore(s => s.cssRules);
  const setCssRules = useAppStore(s => s.setCssRules);
  const htmlPaneView = useAppStore(s => s.htmlPaneView);
  const darkMode = localStorage.getItem('theme') === 'dark';
  
  const [showModal, setShowModal] = useState(false);
  const [showValuePicker, setShowValuePicker] = useState(null);
  const [editingVar, setEditingVar] = useState(false);
  const [newVar, setNewVar] = useState('');
  const [newVal, setNewVal] = useState('');
  const [cssText, setCssText] = useState('');
  const [textContent, setTextContent] = useState('');
  const [view, setView] = useState<'properties' | 'css' | 'text'>('properties');

  // Find the selected node
  const selectedNode = React.useMemo(() => {
    if (!selectedNodeId) return null;
    
    const findNode = (nodes) => {
      for (const node of nodes) {
        if (node.id === selectedNodeId) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return null;
    };
    
    return findNode(treeData);
  }, [selectedNodeId, treeData]);
  
  // Update text content when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setTextContent(selectedNode.textContent || '');
      
      // Generate CSS text from all rules
      const cssString = cssRules.map(rule => {
        const properties = Object.entries(rule.properties)
          .map(([k, v]) => `  ${k}: ${v};`)
          .join('\n');
        return `${rule.selector} {\n${properties}\n}`;
      }).join('\n\n');
      
      setCssText(cssString);
    }
  }, [selectedNode, cssRules]);
  
  // Function to update text content of selected node
  const updateTextContent = React.useCallback((newText) => {
    if (selectedNodeId && selectedNode) {
      const updateNode = (nodes) => {
        return nodes.map(node => {
          if (node.id === selectedNodeId) {
            return { ...node, textContent: newText };
          }
          if (node.children.length) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };
      
      setTreeData(updateNode(treeData));
    }
  }, [selectedNodeId, selectedNode, treeData, setTreeData]);
  
  // Filter rules for selected node
  const scopedRules = selectedNodeId
    ? cssRules.filter(r => r.selector.includes(`#${selectedNodeId}`) || r.selector.includes(`.${selectedNodeId}`))
    : cssRules;

  // Check if element can have text content
  const canHaveTextContent = selectedNode && !['br', 'hr', 'img', 'input', 'iframe', 'canvas', 'audio', 'video'].includes(selectedNode.tag);

  // Dummy variables and pseudo-elements
  const cssVars = [
    { name: '--main-color', value: 'blue' },
    { name: '--padding', value: '16px' },
  ];
  
  // Only show pseudo-elements for elements that can have them
  const hasPseudoElements = selectedNode && !['br', 'meta', 'link', 'script', 'style', 'head', 'title'].includes(selectedNode.tag);
  const pseudo = hasPseudoElements ? [
    { selector: '::before', properties: { content: '""', color: 'gray' } },
    { selector: '::after', properties: { content: '""', color: 'gray' } },
  ] : [];

  // Handle CSS changes from editor
  const handleCssChange = React.useCallback((value) => {
    // In a real app, this would parse the CSS and update the cssRules
    setCssText(value || '');
  }, []);

  function handleAddProperty(prop) {
    setShowModal(false);
    setShowValuePicker(prop);
  }
  
  function handlePickValue(val) {
    // For demo, just add to first rule
    if (scopedRules.length > 0 && showValuePicker) {
      const rule = { ...scopedRules[0] };
      rule.properties[showValuePicker] = val;
      setCssRules(cssRules.map(r => r === scopedRules[0] ? rule : r));
    }
    setShowValuePicker(null);
  }
  
  function handleAddVar() {
    setEditingVar(false);
    // Would update CSSOM in real app
  }

  return (
    <div className="figma-scroll flex-1 p-3" aria-label="CSS Inspector" role="region">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold text-[var(--text-primary)]">
          {selectedNodeId ? `#${selectedNodeId}` : 'Global Stylesheet'}
        </span>

        {/* View toggle buttons */}
        <div className="ml-auto flex gap-1">
          <button 
            className={`figma-btn ${view === 'properties' ? 'active' : ''}`} 
            onClick={() => setView('properties')}
          >
            Properties
          </button>
          <button 
            className={`figma-btn ${view === 'text' ? 'active' : ''}`} 
            onClick={() => setView('text')}
            style={{opacity: canHaveTextContent ? 1 : 0.5}}
            disabled={!canHaveTextContent}
          >
            Text
          </button>
          <button 
            className={`figma-btn ${view === 'css' ? 'active' : ''}`} 
            onClick={() => setView('css')}
          >
            CSS
          </button>
          {view === 'properties' && (
            <button 
              className="figma-btn flex items-center gap-1" 
              onClick={() => setShowModal(true)}
            >
              <span>+</span> Add
            </button>
          )}
        </div>
      </div>
      
      {/* Properties View */}
      {view === 'properties' && (
        <>
          {/* CSS Rules */}
          {scopedRules.map(rule => (
            <div key={rule.selector} className="mb-3 border border-[var(--border-default)] rounded-md p-2 bg-[var(--bg-surface)]">
              <div className="font-mono text-xs text-[var(--text-secondary)] mb-1">{rule.selector}</div>
              <div className="space-y-1">
                {Object.entries(rule.properties).map(([k, v]) => (
                  <div key={k} className="flex items-center text-sm">
                    <span className="w-32 text-right text-[var(--text-secondary)]">{k}</span>
                    <span className="font-mono text-[var(--text-primary)] ml-2">{v}</span>
                    <span className="ml-2 text-xs bg-[#E8F1FF] dark:bg-[rgba(30,99,236,0.2)] text-[#1E63EC] dark:text-[#85B4FF] rounded px-1">inline</span>
                    <button className="ml-auto text-[var(--text-secondary)] hover:text-[var(--error)]">✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
            {/* Cascade bands */}
          <div className="mt-4">
            <div className="text-xs text-[var(--text-secondary)] mb-1 font-semibold">Cascade</div>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-[#E8F1FF] dark:bg-[rgba(30,99,236,0.2)] text-[#1E63EC] dark:text-[#85B4FF] px-2 py-0.5 rounded text-xs">inline</span>
              <span className="bg-[#E8F9EF] dark:bg-[rgba(30,179,103,0.2)] text-[#1EB367] dark:text-[#7EDDAB] px-2 py-0.5 rounded text-xs">class</span>
              <span className="bg-[#FFF5E0] dark:bg-[rgba(249,166,68,0.2)] text-[#F9A644] dark:text-[#FFD599] px-2 py-0.5 rounded text-xs">id</span>
              <span className="bg-[#F2F2F2] dark:bg-[rgba(128,128,128,0.2)] text-[#666666] dark:text-[#A0A0A0] px-2 py-0.5 rounded text-xs">external</span>
              <span className="bg-[#ECECEC] dark:bg-[rgba(100,100,100,0.2)] text-[#555555] dark:text-[#909090] px-2 py-0.5 rounded text-xs">inherited</span>
            </div>
          </div>
          
          {/* CSS Variables */}
          <div className="mt-4">
            <div className="text-xs text-[var(--text-secondary)] font-semibold mb-1">CSS Variables</div>
            <div className="space-y-1">
              {cssVars.map(v => (
                <div key={v.name} className="flex items-center text-sm">
                  <span className="w-32 text-right text-[var(--text-secondary)]">{v.name}</span>
                  <input 
                    className="font-mono border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] px-2 py-0.5 rounded ml-2" 
                    value={v.value} 
                    readOnly 
                  />
                </div>
              ))}
              
              {editingVar ? (
                <div className="flex gap-2 mt-2">
                  <input 
                    className="font-mono border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] px-2 py-0.5 rounded" 
                    placeholder="--var" 
                    value={newVar} 
                    onChange={e => setNewVar(e.target.value)} 
                  />
                  <input 
                    className="font-mono border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] px-2 py-0.5 rounded" 
                    placeholder="value" 
                    value={newVal} 
                    onChange={e => setNewVal(e.target.value)} 
                  />
                  <button className="figma-btn active" onClick={handleAddVar}>Add</button>
                </div>
              ) : (
                <button className="figma-btn mt-2 flex items-center gap-1" onClick={() => setEditingVar(true)}>
                  <span>+</span> Add Variable
                </button>
              )}
            </div>
          </div>
          
          {/* Inheritance panel */}
          <div className="mt-4">
            <div className="text-xs text-[var(--text-secondary)] font-semibold mb-1">Inherited Properties</div>
            <div className="text-[var(--text-secondary)] text-xs">
              color: gray <span className="ml-2 bg-[var(--bg-muted)] px-1 rounded">from body</span>
            </div>
          </div>
          
          {/* Pseudo-elements - only show for elements that have them */}
          {hasPseudoElements && (
            <div className="mt-4 mb-2">
              <div className="text-xs text-[var(--text-secondary)] font-semibold mb-1">Pseudo-elements</div>
              {pseudo.map(p => (
                <div key={p.selector} className="flex items-center gap-2 text-sm">
                  <span className="w-24 text-right text-[var(--text-secondary)]">{p.selector}</span>
                  <span className="font-mono text-xs text-[var(--text-primary)]">
                    {Object.entries(p.properties).map(([k, v]) => (
                      <span key={k} className="mr-2">{k}: {v};</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Text Content View */}
      {view === 'text' && canHaveTextContent && (
        <div className="mt-2">
          <div className="text-xs text-[var(--text-secondary)] font-semibold mb-2">Text Content</div>
          <div className="border border-[var(--border-default)] rounded-md bg-[var(--bg-surface)] p-2">
            <textarea
              className="w-full min-h-[150px] font-mono bg-transparent border-none outline-none text-[var(--text-primary)] resize-vertical p-1"
              value={textContent}
              onChange={(e) => {
                setTextContent(e.target.value);
                updateTextContent(e.target.value);
              }}
              placeholder="Enter text content..."
            />
          </div>
          <div className="mt-2 text-xs text-[var(--text-secondary)]">
            Text content will be updated in real-time in the DOM tree and live preview.
          </div>
        </div>
      )}
      
      {/* CSS Editor View */}
      {view === 'css' && (
        <div className="mt-2 h-full flex flex-col">
          <div className="text-xs text-[var(--text-secondary)] font-semibold mb-2">CSS Editor</div>
          <div className="flex-grow h-full min-h-[300px] border border-[var(--border-default)] rounded-md overflow-hidden">
            <MonacoEditor
              height="100%"
              language="css"
              theme={darkMode ? 'vs-dark' : 'light'}
              value={cssText}
              onChange={handleCssChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                renderLineHighlight: 'line',
                lineNumbers: 'on',
                tabSize: 2,
              }}
            />
          </div>
          <div className="mt-2 text-xs text-[var(--text-secondary)]">
            Changes to CSS will affect the rendered output in real-time.
          </div>
        </div>
      )}
      
      {showModal && <PropertyModal onSelect={handleAddProperty} onClose={() => setShowModal(false)} />}
      {showValuePicker && <ValuePicker property={showValuePicker} onPick={handlePickValue} onClose={() => setShowValuePicker(null)} />}
    </div>
  );
}
