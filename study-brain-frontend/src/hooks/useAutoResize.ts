import { useCallback, useRef } from 'react';

export function useAutoResize(maxHeight = 160) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    // Reset first so shrinking works
    el.style.height = '36px';
    const scrollH = el.scrollHeight;
    const newH = Math.min(scrollH, maxHeight);
    el.style.height = `${newH}px`;
    el.style.overflowY = scrollH > maxHeight ? 'auto' : 'hidden';
  }, [maxHeight]);

  return { textareaRef, adjustHeight };
}
