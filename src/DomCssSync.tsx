import { useEffect } from 'react';
import { useAppStore } from './store';

export default function DomCssSync() {
  const setTreeData = useAppStore(s => s.setTreeData);
  const setCssRules = useAppStore(s => s.setCssRules);
  const treeData = useAppStore(s => s.treeData);
  const cssRules = useAppStore(s => s.cssRules);

  // We no longer need to inject CSS directly into the document
  // as it will be handled by the iframe in LiveRender
  // This component now only needs to observe DOM changes if needed
  // For iframe approach, we'd need to use postMessage or other methods
  // to communicate between the main app and the iframe content
  // This is a placeholder for that functionality
  useEffect(() => {
    // Handle any necessary communication between the main app and the preview iframe
    // This would be implemented if we need to sync changes from the iframe back to our model
  }, [setTreeData, treeData]);
  
  return null;
}
