import { useEffect, useRef } from 'react';

export function useOutSideClickEvent(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutSideClick(event: MouseEvent) {
      const clickedElement = event.target as HTMLElement;
      if (clickedElement === ref.current || ref.current?.contains(clickedElement)) {
        return;
      }
      callback();
    }

    document.addEventListener('mousedown', handleOutSideClick);

    return () => document.removeEventListener('mousedown', handleOutSideClick);
  }, []);

  return ref;
}
