import React from 'react';
import { TreeNode, tagIconMap, HtmlPaneView } from './types';
import { useAppStore } from './store';
import * as icons from 'lucide-react';
import MonacoEditor from '@monaco-editor/react';

interface TreeViewProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  onStartNew: () => void;
}

function getIcon(tag: string) {
  const iconName = tagIconMap[tag] || tagIconMap.default;
  const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  return icons[iconKey] || icons['Square'];
}

function NodeLabel({ node }: { node: TreeNode }) {
  const IconComp = getIcon(node.tag);
  return (
    <span className="flex items-center gap-2">
      <span className="rounded bg-[var(--bg-muted)] p-1 flex items-center justify-center">
        <IconComp className="w-4 h-4 text-[var(--text-secondary)]" />
      </span>
      <span className="font-mono text-xs text-[var(--text-primary)]">{node.tag}</span>
      {node.idAttr && <span className="text-[var(--accent)]">#{node.idAttr}</span>}
      {node.classes.length > 0 && (
        <span className="text-green-600 text-xs">.{node.classes.join('.')}</span>
      )}
    </span>
  );
}

function TreeNode({ node, depth }: { node: TreeNode; depth: number }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const selectedNodeId = useAppStore(s => s.selectedNodeId);
  const setSelectedNodeId = useAppStore(s => s.setSelectedNodeId);
  const setHoveredNodeId = useAppStore(s => s.setHoveredNodeId);
  const ref = React.useRef<HTMLDivElement>(null);
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') setSelectedNodeId(node.id);
  }
  return (
    <div>
      <div
        ref={ref}
        className={`flex items-center px-2 py-1 cursor-pointer rounded ${selectedNodeId === node.id ? 'bg-[var(--bg-active)]' : 'hover:bg-[var(--bg-hover)]'}`}
        style={{ marginLeft: depth * 16 }}
        onClick={() => setSelectedNodeId(node.id)}
        onMouseEnter={() => setHoveredNodeId(node.id)}
        onMouseLeave={() => setHoveredNodeId(undefined)}
        tabIndex={0}
        role="treeitem"
        aria-selected={selectedNodeId === node.id}
        onKeyDown={handleKeyDown}
      >
        {node.children.length > 0 && (
          <button
            className="mr-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={e => { e.stopPropagation(); setCollapsed(c => !c); }}
            aria-label={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '+' : '–'}
          </button>
        )}
        <NodeLabel node={node} />
      </div>
      {!collapsed && node.children.map(child => (
        <TreeNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function TreeView({ darkMode, setDarkMode, onStartNew }: TreeViewProps) {  const treeData = useAppStore(s => s.treeData);
  const setTreeData = useAppStore(s => s.setTreeData);
  const htmlPaneView = useAppStore(s => s.htmlPaneView);
  const setHtmlPaneView = useAppStore(s => s.setHtmlPaneView);
  const [raw, setRaw] = React.useState('');
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (htmlPaneView === 'code') {
      setRaw(serialize(treeData));
    }
  }, [htmlPaneView, treeData]);  function serialize(nodes: TreeNode[]): string {
    return nodes.map(node => {
      const attrs = [
        node.idAttr ? `id=\"${node.idAttr}\"` : '',
        node.classes.length ? `class=\"${node.classes.join(' ')}\"` : ''
      ].filter(Boolean).join(' ');
      return `<${node.tag}${attrs ? ' ' + attrs : ''}>${node.textContent || ''}${serialize(node.children)}</${node.tag}>`;
    }).join('');
  }

  // Hamburger menu icon
  const MenuIcon = icons.Menu;

  return (
    <div className="figma-scroll flex-1 min-h-0 min-w-0 overflow-hidden flex flex-col relative">
      {/* Hamburger menu */}
      <div className="absolute top-2 left-2 z-20">
        <button
          className="figma-btn figma-btn-icon"
          onClick={() => setMenuOpen(m => !m)}
          aria-label="Open menu"
        >
          <MenuIcon className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
        
        {menuOpen && (
          <div className="figma-menu absolute left-0 mt-1">
            <button 
              className="figma-menu-item w-full" 
              onClick={() => { onStartNew(); setMenuOpen(false); }}
            >
              <icons.FileText className="w-4 h-4" /> Start New
            </button>
            <div className="figma-divider" />
            <div className="figma-menu-item flex justify-between">
              <span className="flex items-center gap-2">
                <icons.Moon className="w-4 h-4" /> Dark Mode
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={darkMode} 
                  onChange={e => setDarkMode(e.target.checked)} 
                />
                <div className="w-9 h-5 bg-[var(--bg-muted)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[var(--bg-surface)] after:border-[var(--border-default)] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]"></div>
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* View toggle buttons */}
      <div className="figma-toolbar pl-10 border-b border-[var(--border-default)]">
        <button 
          className={`figma-btn ${htmlPaneView === 'tree' ? 'active' : ''}`} 
          onClick={() => setHtmlPaneView('tree')}
        >
          <icons.Layers className="w-4 h-4" /> Tree
        </button>
        <button 
          className={`figma-btn ${htmlPaneView === 'code' ? 'active' : ''}`} 
          onClick={() => setHtmlPaneView('code')}
        >
          <icons.Code className="w-4 h-4" /> Code
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
        {htmlPaneView === 'tree' ? (
          <div className="figma-scroll h-full p-2">
            {treeData && treeData.length > 0 ? treeData.map(node => (
              <TreeNode key={node.id} node={node} depth={0} />
            )) : <div className="p-2 text-[var(--text-secondary)]">No HTML loaded</div>}
          </div>
        ) : (
          <div className="h-full w-full overflow-hidden">            <MonacoEditor
              height="100%"
              width="100%"
              defaultLanguage="html"
              value={raw}
              onChange={v => {
                setRaw(v || '');
                // Try to parse the HTML and update the tree data
                try {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(v || '', 'text/html');
                  const nodeTree = parseNodeToTree(doc.body);
                  if (nodeTree.length > 0) {
                    setTreeData(nodeTree);
                  }
                } catch (e) {
                  console.error('Error parsing HTML:', e);
                }
              }}
              theme={darkMode ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                renderLineHighlight: 'line',
                lineNumbers: 'on',
                tabSize: 2,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Add parseNodeToTree function before export default
function parseNodeToTree(element: Element): TreeNode[] {
  const nodeList: TreeNode[] = [];
  
  // Skip comment nodes and other non-element nodes
  if (element.nodeType !== Node.ELEMENT_NODE) return nodeList;
  
  const classList = Array.from(element.classList || []);
  const id = element.id || undefined;
  const tag = element.tagName.toLowerCase();
  
  // Extract text content (direct text nodes only, not from child elements)
  let textContent = '';
  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE && child.textContent) {
      textContent += child.textContent;
    }
  }
  
  // Trim whitespace
  textContent = textContent.trim();
  
  // Create the node object
  const node: TreeNode = {
    id: id || Date.now().toString() + Math.random().toString(36).substr(2, 5),
    tag,
    classes: classList,
    idAttr: id,
    textContent: textContent || undefined,
    children: []
  };
  
  // Process child elements
  for (const child of Array.from(element.children)) {
    const childNodes = parseNodeToTree(child);
    if (childNodes.length > 0) {
      node.children.push(...childNodes);
    }
  }
  
  nodeList.push(node);
  return nodeList;
}
