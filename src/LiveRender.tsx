import React, { useRef, useEffect } from 'react';
import { useAppStore } from './store';

export default function LiveRender() {
  const treeData = useAppStore(s => s.treeData);
  const cssRules = useAppStore(s => s.cssRules);
  const selectedNodeId = useAppStore(s => s.selectedNodeId);
  const hoveredNodeId = useAppStore(s => s.hoveredNodeId);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Function to generate HTML content for the iframe
  const generateHtmlContent = () => {
    // Convert tree data to HTML
    const renderNodeToHTML = (node) => {
      const tag = node.tag === 'html' || node.tag === 'body' ? 'div' : node.tag;
      const isSelected = node.id === selectedNodeId;
      const isHovered = node.id === hoveredNodeId;
      
      let outlineStyle = '';
      if (isSelected) {
        outlineStyle = 'outline: 2px solid #3B82F6; box-shadow: 0 0 0 1px white, 0 0 0 4px rgba(59, 130, 246, 0.3);';
      } else if (isHovered) {
        outlineStyle = 'outline: 1px dashed #3B82F6;';
      }
      
      const hasTextContent = node.textContent && node.textContent.trim() !== '';
      const hasChildElements = node.children && node.children.length > 0;
      
      const idAttr = node.idAttr ? ` id="${node.idAttr}"` : '';
      const classAttr = node.classes && node.classes.length > 0 ? ` class="${node.classes.join(' ')}"` : '';
      const styleAttr = outlineStyle ? ` style="${outlineStyle}"` : '';
      
      let content = '';
      if (hasTextContent) content += node.textContent;
      if (hasChildElements) content += node.children.map(renderNodeToHTML).join('');
      
      return `<${tag}${idAttr}${classAttr}${styleAttr}>${content}</${tag}>`;
    };
    
    // Generate CSS from rules
    const cssText = cssRules.map(rule => {
      const properties = Object.entries(rule.properties)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n');
      return `${rule.selector} {\n${properties}\n}`;
    }).join('\n\n');    // Create a complete HTML document with strict isolation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!-- Prevent any navigation to external resources -->
          <base target="_self">
          <!-- Completely disable all external resource loading -->
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src 'none'; connect-src 'none'; media-src 'none'; object-src 'none'; child-src 'none'; frame-src 'none'; worker-src 'none'; script-src 'none';">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: white;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            }
            /* Custom CSS from editor */
            ${cssText}
          </style>
        </head>
        <body>
          ${treeData && treeData.length > 0 ? treeData.map(renderNodeToHTML).join('') : ''}
        </body>
      </html>
    `;
    
    return htmlContent;
  };
  // We no longer need this effect as we're using srcDoc attribute
  // which will automatically update when the generateHtmlContent() result changes
  useEffect(() => {
    // Add any necessary cleanup or additional iframe setup here if needed
    const iframe = iframeRef.current;
    
    if (iframe && iframe.contentWindow) {
      // Prevent any navigation attempts within the iframe
      const handleNavigation = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      // Add listeners to block any navigation attempts
      try {
        iframe.contentWindow.addEventListener('beforeunload', handleNavigation);
        iframe.contentWindow.addEventListener('unload', handleNavigation);
      } catch (error) {
        console.error("Error setting up iframe listeners:", error);
      }
      
      return () => {
        try {
          iframe.contentWindow?.removeEventListener('beforeunload', handleNavigation);
          iframe.contentWindow?.removeEventListener('unload', handleNavigation);
        } catch (error) {
          // Ignore cleanup errors
        }
      };
    }
  }, [iframeRef.current]);

  if (!treeData || treeData.length === 0) return (
    <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)]">
      No HTML loaded
    </div>
  );
  return (
    <div className="flex-1 border-t border-[var(--border-default)] overflow-hidden live-render-container">      <iframe 
        ref={iframeRef}
        title="Live Preview"
        className="w-full h-full border-0"
        sandbox="allow-same-origin"
        srcDoc={generateHtmlContent()}
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
