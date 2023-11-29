import { useMemo } from 'react';

interface TarotCardProps {
  dragging: boolean;
  backImg: string;
  frontImg: string;
}

export default function TarotCard({ dragging, backImg, frontImg }: TarotCardProps) {
  const tarotCardStyle = useMemo(
    () => `${!dragging && 'hover:animate-tarotHovering'} animate-tarotLeaving w-full h-full -translate-y-1000 absolute`,
    [dragging],
  );

  return (
    <>
      <img
        className={tarotCardStyle}
        style={{ backfaceVisibility: 'hidden' }}
        src={backImg}
        alt="타로 카드 뒷면 이미지"
      />
      <img
        className={tarotCardStyle}
        style={{ backfaceVisibility: 'hidden', rotate: 'y 180deg' }}
        src={frontImg}
        alt="타로 카드 앞면 이미지"
      />
    </>
  );
}
