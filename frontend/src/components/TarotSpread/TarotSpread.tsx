import Background from '../Background';
import { useEffect, useRef, useState } from 'react';

import { getTarotImageQuery } from '@stores/queries/getTarotImageQuery';

import { TAROT_CARDS_LENGTH } from '@constants/sizes';

import TarotCard from './TarotCard';

interface TarotSpreadProps {
  opened: boolean;
  close: () => void;
  pickCard: (idx: number) => void;
}

const spreadSound = new Audio('/spreadCards.mp3');
const flipSound = new Audio('/flipCard.mp3');

export default function TarotSpread({ opened, close, pickCard }: TarotSpreadProps) {
  const [closing, setClosing] = useState<boolean>(!opened);
  const [dragging, setDragging] = useState<boolean>(false);
  const [pickedId, setPickedId] = useState<number>(0);

  const tarotCardRefs = useRef<HTMLDivElement[]>([]);
  const prevMouseXRef = useRef<number>(0);
  const tarotSpreadRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<number>(0);

  const backImg = getTarotImageQuery(TAROT_CARDS_LENGTH).data.cardUrl;
  const frontImg = getTarotImageQuery(pickedId).data.cardUrl;

  useEffect(() => {
    setPickedId(Math.floor(Math.random() * TAROT_CARDS_LENGTH));
    const rotateSpread = ({ deltaX }: WheelEvent) => rotateTarotSpread(deltaX > 0 ? 'left' : 'right');
    const closeWithFadeOut = ({ animationName }: AnimationEvent) => animationName == 'fadeOut' && close();

    addEventListener('wheel', rotateSpread);
    addEventListener('animationend', closeWithFadeOut);
    setTimeout(spreadTarotCards, 10);

    return () => {
      removeEventListener('wheel', rotateSpread);
      removeEventListener('animationend', closeWithFadeOut);
    };
  }, []);

  const dragTarotSpread = ({ pageX }: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) rotateTarotSpread(prevMouseXRef.current < pageX ? 'right' : 'left');
    prevMouseXRef.current = pageX;
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
      ref.style.transform = `rotate(${270 + idx * 4.6}deg) rotateY(0deg) perspective(800px)`;
      ref.style.transformStyle = 'preserve-3d';
      ref.style.transition = 'transform 1s ease-out';
    });
  };

  const unSpreadTarotCards = () => {
    spreadSound.play();
    tarotSpreadRef.current!.style.transform = `translateX(-50%) rotate(0deg)`;
    setTimeout(() => tarotCardRefs.current.forEach(ref => (ref.style.transform = `rotate(270deg)`)), 200);
  };

  const flipCard = async (card: HTMLDivElement) => {
    flipSound.play();
    tarotSpreadRef.current!.style.pointerEvents = 'none';

    const unFlippedStyle = 'rotateY(0deg)';
    const flippedStyle = 'rotateY(180deg) scale(1.3) translateY(240px)';

    card.style.zIndex = '1000';
    card.style.transform = card.style.transform.replace(unFlippedStyle, flippedStyle);

    pickCard(pickedId);
    setTimeout(() => unSpreadTarotCards(), 1500);
    setTimeout(() => setClosing(true), 2000);
  };

  return (
    <Background type={`${closing ? 'close' : 'open'}`}>
      <div
        ref={tarotSpreadRef}
        onMouseMove={dragTarotSpread}
        onMouseDown={() => setDragging(true)}
        onMouseLeave={() => setDragging(false)}
        onMouseUp={() => setDragging(false)}
        className="transition-all ease-out absolute w-220 h-400 sm:w-160 sm:h-270 origin-center top-1200 left-[50%] translate-x-[-50%] sm:top-[40vh] sm:left-1200"
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
    </Background>
  );
}
