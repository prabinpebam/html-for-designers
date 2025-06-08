import React, { useState } from 'react';
import { useAppStore } from './store';
import MonacoEditor from '@monaco-editor/react';

export default function HtmlEditor() {
  const treeData = useAppStore(s => s.treeData);
  const setTreeData = useAppStore(s => s.setTreeData);
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState('');

  function serialize(nodes) {
    return nodes.map(node => {
      const attrs = [
        node.idAttr ? `id=\"${node.idAttr}\"` : '',
        node.classes.length ? `class=\"${node.classes.join(' ')}\"` : ''
      ].filter(Boolean).join(' ');
      return `<${node.tag}${attrs ? ' ' + attrs : ''}>${serialize(node.children)}</${node.tag}>`;
    }).join('');
  }

  function handleEdit() {
    setRaw(serialize(treeData));
    setEditing(true);
  }

  function handleSave() {
    // TODO: parse raw HTML to treeData
    setEditing(false);
  }

  if (!editing) return <button className="mt-2 px-2 py-1 bg-gray-200 rounded" onClick={handleEdit}>Edit HTML</button>;
  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="w-full h-64 border rounded overflow-hidden">
        <MonacoEditor
          height="100%"
          defaultLanguage="html"
          value={raw}
          onChange={v => setRaw(v || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      <div className="flex gap-2">
        <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={handleSave}>Save</button>
        <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => setEditing(false)}>Cancel</button>
      </div>
    </div>
  );
}
