import React from 'react';
import { useAppStore } from './store';

export default function LiveRender() {
  const treeData = useAppStore(s => s.treeData);
  const selectedNodeId = useAppStore(s => s.selectedNodeId);
  const hoveredNodeId = useAppStore(s => s.hoveredNodeId);
  function renderNode(node) {
    const Tag = node.tag === 'html' || node.tag === 'body' ? 'div' : node.tag;
    const isSelected = node.id === selectedNodeId;
    const isHovered = node.id === hoveredNodeId;
    
    let outlineStyle = {};
    if (isSelected) {
      outlineStyle = { 
        outline: '2px solid var(--accent)',
        boxShadow: '0 0 0 1px var(--bg-surface), 0 0 0 4px rgba(var(--color-blue-500-rgb), 0.3)'
      };
    } else if (isHovered) {
      outlineStyle = { 
        outline: '1px dashed var(--accent)'
      };
    }
    
    // Handle text content for nodes that can have it
    const hasTextContent = node.textContent && node.textContent.trim() !== '';
    const hasChildElements = node.children && node.children.length > 0;
    
    return (
      <Tag
        key={node.id}
        id={node.idAttr}
        className={node.classes.join(' ')}
        style={outlineStyle}
      >
        {hasTextContent && node.textContent}
        {hasChildElements && node.children.map(renderNode)}
      </Tag>
    );
  }

  if (!treeData || treeData.length === 0) return (
    <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)]">
      No HTML loaded
    </div>
  );
    return (
    <div className="flex-1 p-4 bg-white dark:bg-gray-900 border-t border-[var(--border-default)] overflow-auto live-render-container">
      {treeData.map(renderNode)}
    </div>
  );
}
