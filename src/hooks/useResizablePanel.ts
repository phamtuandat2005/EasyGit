import { useState, useCallback, useEffect, useRef } from 'react';

interface UseResizablePanelProps {
  initialSize: number;
  minSize: number;
  maxSize: number;
  direction: 'horizontal' | 'vertical';
  side: 'left' | 'right' | 'top' | 'bottom';
}

export function useResizablePanel({ initialSize, minSize, maxSize, direction, side }: UseResizablePanelProps) {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const sizeRef = useRef(size);

  // Keep ref in sync
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseEvent: MouseEvent) => {
      if (!isResizing) return;

      let newSize = sizeRef.current;
      
      // We only support left and right for now (sidebar and context panel)
      if (side === 'left') {
        newSize = mouseEvent.clientX;
      } else if (side === 'right') {
        newSize = window.innerWidth - mouseEvent.clientX;
      }

      if (newSize >= minSize && newSize <= maxSize) {
        setSize(newSize);
      } else if (newSize < minSize) {
        setSize(minSize);
      } else if (newSize > maxSize) {
        setSize(maxSize);
      }
    },
    [isResizing, minSize, maxSize, side]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return { size, isResizing, startResizing };
}
