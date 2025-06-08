import React, { useState } from 'react';
import * as icons from 'lucide-react';
import { tagIconMap } from './types';

const htmlTags = [
  'div', 'span', 'section', 'article', 'header', 'footer', 'main', 'nav', 'aside',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'a', 'img', 'button', 'input', 'form'
];

export default function TagSelectorModal({ onAdd, onClose }) {
  const [tag, setTag] = useState('div');
  const [idAttr, setIdAttr] = useState('');
  const [classes, setClasses] = useState('');

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-4 min-w-[320px]">
        <div className="mb-2 font-bold">Add New Element</div>
        <div className="flex gap-2 mb-2">
          <select value={tag} onChange={e => setTag(e.target.value)} className="border rounded px-2 py-1">
            {htmlTags.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span className="flex items-center gap-1">
            {(() => {
              const iconName = tagIconMap[tag] || tagIconMap.default;
              const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
              const IconComp = icons[iconKey] || icons['Square'];
              return <IconComp className="w-5 h-5 text-gray-500" />;
            })()}
          </span>
        </div>
        <input className="border rounded px-2 py-1 mb-2 w-full" placeholder="id (optional)" value={idAttr} onChange={e => setIdAttr(e.target.value)} />
        <input className="border rounded px-2 py-1 mb-2 w-full" placeholder="classes (space separated)" value={classes} onChange={e => setClasses(e.target.value)} />
        <div className="flex gap-2 mt-2">
          <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => onAdd({ tag, idAttr, classes: classes.split(' ').filter(Boolean) })}>Add</button>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
