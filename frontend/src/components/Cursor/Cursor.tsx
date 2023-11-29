import { useEffect, useRef } from 'react';

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
    addEventListener('touchmove', setCursor);

    return () => {
      removeEventListener('scroll', setCursor);
      removeEventListener('mousemove', setCursor);
      removeEventListener('touchmove', setCursor);
    };
  });

  return (
    <div
      ref={cursorRef}
      className="cursor"
    />
  );
}

export default Cursor;
