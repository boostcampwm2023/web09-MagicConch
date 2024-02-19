import { Background, TarotCard } from '..';
import { detect } from 'detect-browser';
import React, { useEffect, useRef, useState } from 'react';

import { getTarotImageQuery } from '@stores/queries';

import { TAROT_CARDS_LENGTH } from '@constants/sizes';

const browser = detect();
const __iOS__ = browser?.os?.includes('iOS');

interface TarotSpreadProps {
  opened: boolean;
  closeSpread: () => void;
  pickCard: (idx: number) => void;
}

interface PageOffset {
  pageX: number;
  pageY: number;
}

const spreadSound = new Audio('/spreadCards.mp3');
const flipSound = new Audio('/flipCard.mp3');

export function TarotSpread({ opened, closeSpread, pickCard }: TarotSpreadProps) {
  const [closing, setClosing] = useState<boolean>(!opened);
  const [dragging, setDragging] = useState<boolean>(false);
  const [pickedId, setPickedId] = useState<number>(0);

  const prevMouseRef = useRef<PageOffset>({ pageX: 0, pageY: 0 });
  const prevTouchRef = useRef<PageOffset>({ pageX: 0, pageY: 0 });

  const tarotCardRefs = useRef<HTMLDivElement[]>([]);
  const tarotSpreadRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<number>(0);

  const backImg = getTarotImageQuery(TAROT_CARDS_LENGTH).data.cardUrl;
  const frontImg = getTarotImageQuery(pickedId).data.cardUrl;

  const isPortrait = window.innerWidth < 1024;

  useEffect(() => {
    setPickedId(Math.floor(Math.random() * TAROT_CARDS_LENGTH));
    const closeWithFadeOut = ({ animationName }: AnimationEvent) => animationName == 'fadeOut' && closeSpread();

    addEventListener('animationend', closeWithFadeOut);
    setTimeout(spreadTarotCards, 10);

    return () => removeEventListener('animationend', closeWithFadeOut);
  }, []);

  const startDragging = () => setDragging(true);
  const endDragging = () => setDragging(false);

  const dragTarotSpread = ({ pageX, pageY }: React.MouseEvent<HTMLDivElement>) => {
    const { pageX: prevPageX, pageY: prevPageY } = prevMouseRef.current;
    if (dragging) rotateTarotSpread((isPortrait ? prevPageY < pageY : prevPageX < pageX) ? 'right' : 'left');
    prevMouseRef.current = { pageX, pageY };
  };

  const wheelTarotSpread = ({ deltaX, deltaY }: React.WheelEvent<HTMLDivElement>) =>
    rotateTarotSpread((isPortrait ? deltaY > 0 : deltaX > 0) ? 'left' : 'right');

  const touchTarotSpread = (event: React.TouchEvent<HTMLDivElement>) => {
    const { touches } = event;
    const { pageX: prevPageX, pageY: prevPageY } = prevTouchRef.current;
    const { pageX, pageY } = { pageX: touches.item(0)?.pageX ?? 0, pageY: touches.item(0)?.pageY ?? 0 };
    rotateTarotSpread((isPortrait ? prevPageY < pageY : prevPageX < pageX) ? 'right' : 'left');
    prevTouchRef.current = { pageX, pageY };
  };

  const rotateTarotSpread = (direction: 'right' | 'left') => {
    const spread = tarotSpreadRef.current;
    if (!spread) return;

    const rotateIndex = rotationRef.current;
    const nextRotateIndex = direction == 'right' ? rotateIndex + 1 : rotateIndex - 1;
    spread.style.transform = `translateX(-50%) rotate(${nextRotateIndex * 0.6}deg)`;
    rotationRef.current = nextRotateIndex;
  };

  const spreadTarotCards = () => {
    spreadSound.play();
    tarotCardRefs.current.forEach((ref, idx) => {
      ref.style.transform = `rotate(${idx * 4.6}deg) rotateY(0deg) perspective(800px)`;
      ref.style.transformStyle = 'preserve-3d';
      ref.style.transition = 'transform 1s ease-out';
    });
  };

  const unSpreadTarotCards = () => {
    spreadSound.play();
    tarotSpreadRef.current!.style.transform = `translateX(-50%) rotate(270deg)`;
    setTimeout(() => tarotCardRefs.current.forEach(ref => (ref.style.transform = `rotate(0deg)`)), 200);
  };

  const flipCard = async (card: HTMLDivElement) => {
    flipSound.play();
    tarotSpreadRef.current!.style.pointerEvents = 'none';

    const unFlippedStyle = 'rotateY(0deg)';
    const flippedStyle = 'rotateY(180deg) scale(1.2) translateY(160px)';

    card.style.zIndex = '1000';
    card.style.transform = card.style.transform.replace(unFlippedStyle, flippedStyle);

    pickCard(pickedId);
    setTimeout(() => unSpreadTarotCards(), 1500);
    setTimeout(() => setClosing(true), 2000);
  };

  const MouseEventHandler = {
    onWheel: wheelTarotSpread,
    onMouseMove: dragTarotSpread,
    onMouseDown: startDragging,
    onMouseLeave: endDragging,
    onMouseUp: endDragging,
  };

  const TouchEventHandler = {
    onTouchMove: touchTarotSpread,
    onTouchStart: startDragging,
    onTouchEnd: endDragging,
  };

  return (
    <>
      <Background type={`${closing ? 'close' : 'open'}`} />
      <section className="flex-with-center flex-col w-screen h-dvh">
        <div
          ref={tarotSpreadRef}
          {...(!__iOS__ && MouseEventHandler)}
          {...(!__iOS__ && TouchEventHandler)}
          className="transition-all ease-out rotate-[270deg] absolute w-220 h-400 sm:w-160 sm:h-270 origin-center top-1150 left-[50%] translate-x-[-50%] sm:top-[35vh] sm:-left-800 md:top-[35vh] md:-left-700"
        >
          {Array.from({ length: TAROT_CARDS_LENGTH }, (_, idx) => idx).map((_, idx: number) => (
            <div
              key={idx}
              ref={ref => (tarotCardRefs.current[idx] = ref!)}
              className="absolute w-h-full"
              onClick={() => flipCard(tarotCardRefs.current[idx])}
            >
              <TarotCard
                dragging={dragging}
                backImg={backImg}
                frontImg={frontImg}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
