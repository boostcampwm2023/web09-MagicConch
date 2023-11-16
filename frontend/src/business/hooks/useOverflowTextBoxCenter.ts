import { useEffect, useRef } from 'react';

export function useOverflowTextBoxCenter() {
  const textBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textBoxRef.current === null) {
      return;
    }

    const { scrollHeight, clientHeight, scrollWidth, clientWidth } = textBoxRef.current;

    const isScrollableWidth = scrollWidth > clientWidth;
    const isScrollableHeight = scrollHeight > clientHeight;

    if (isScrollableWidth) {
      textBoxRef.current.classList.remove('justify-center');
    }
    if (isScrollableHeight) {
      textBoxRef.current.classList.remove('items-center');
    }
  }, []);

  return {
    textBoxRef,
  };
}
