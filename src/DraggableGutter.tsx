import React, { useRef, useEffect } from 'react';
import { useAppStore } from './store';

export default function DraggableGutter({ onDrag, index }: { onDrag: (delta: number) => void; index: number }) {
  const dragging = useRef(false);
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (dragging.current) {
        onDrag(e.movementX);
      }
    }
    function onMouseUp() {
      dragging.current = false;
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onDrag]);
  return (
    <div
      className="w-1 flex items-center justify-center cursor-col-resize hover:bg-[var(--accent)] group relative z-10"
      onMouseDown={() => (dragging.current = true)}
      aria-label={`Resize pane ${index}`}
      role="separator"
      tabIndex={0}
    >
      <div className="absolute h-full w-4 flex items-center justify-center">
        <div className="w-px h-8 bg-[var(--border-default)] group-hover:bg-[var(--accent)]"></div>
      </div>
    </div>
  );
}
