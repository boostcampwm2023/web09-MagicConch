import { detect } from 'detect-browser';
import { useEffect, useRef } from 'react';

const browser = detect();
const __iOS__ = browser?.os?.includes('iOS');

function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  const setCursor = (e: Event) => {
    const { pageX, pageY } = e as MouseEvent;

    if (cursorRef.current) {
      cursorRef.current.style.left = pageX + 'px';
      cursorRef.current.style.top = pageY + 'px';
    }
  };

  useEffect(() => {
    addEventListener('scroll', setCursor);
    addEventListener('mousemove', setCursor);

    return () => {
      removeEventListener('scroll', setCursor);
      removeEventListener('mousemove', setCursor);
    };
  });

  return (
    !__iOS__ && (
      <div
        ref={cursorRef}
        className="cursor"
      />
    )
  );
}

export default Cursor;
