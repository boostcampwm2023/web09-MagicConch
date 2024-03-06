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

    setTimeout(() => {
      document.addEventListener('click', handleOutSideClick);
    }, 100);

    return () => document.removeEventListener('click', handleOutSideClick);
  }, []);

  return ref;
}
