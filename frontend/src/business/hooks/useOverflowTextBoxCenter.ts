import { useEffect, useRef } from 'react';

export function useOverflowTextBoxCenter() {
  const textBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textBoxRef.current === null) {
      return;
    }

    const { scrollHeight, clientHeight, scrollWidth, clientWidth } = textBoxRef.current;

    const scrollableWidth = scrollWidth > clientWidth;
    const scrollableHeight = scrollHeight > clientHeight;

    if (scrollableWidth) {
      textBoxRef.current.classList.remove('justify-center');
    }
    if (scrollableHeight) {
      textBoxRef.current.classList.remove('items-center');
    }
  }, []);

  return {
    textBoxRef,
  };
}
