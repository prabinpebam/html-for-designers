import { useEffect } from 'react';
import { useAppStore } from './store';

export default function DomCssSync() {
  const setTreeData = useAppStore(s => s.setTreeData);
  const setCssRules = useAppStore(s => s.setCssRules);
  const treeData = useAppStore(s => s.treeData);
  const cssRules = useAppStore(s => s.cssRules);

  // Update style element with current CSS rules
  useEffect(() => {
    // Create or update style tag for our app
    let styleTag = document.getElementById('figma-css-visualizer-styles');
    
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'figma-css-visualizer-styles';
      document.head.appendChild(styleTag);
    }
    
    // Generate CSS text from rules
    const cssText = cssRules.map(rule => {
      const properties = Object.entries(rule.properties)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n');
      return `${rule.selector} {\n${properties}\n}`;
    }).join('\n\n');
    
    styleTag.textContent = cssText;
    
    return () => {
      // Clean up on unmount
      if (styleTag) {
        styleTag.parentNode?.removeChild(styleTag);
      }
    };
  }, [cssRules]);

  // Create a MutationObserver to watch for DOM changes
  // In a real app, this would sync changes from the browser DOM back to our model
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      // This is a simplified version - in a real app you'd need more complex DOM parsing
      console.log('DOM mutations detected:', mutations.length);
    });
    
    // Start observing only after we've rendered our tree
    const container = document.querySelector('.live-render-container');
    if (container) {
      observer.observe(container, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        characterData: true 
      });
    }
    
    return () => observer.disconnect();
  }, [setTreeData, treeData]);
  
  return null;
}
