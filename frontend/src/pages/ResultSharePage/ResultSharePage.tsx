import { useRef, useState } from 'react';

import { Header } from '@components/common';

import { getResultShareQuery } from '@stores/queries';

import { ResultImage } from './ResultImage';
import { ResultTextBox } from './ResultTextBox';
import { ShareButtonList } from './ShareButtonList';

interface ResultSharePageProps {}

const flipSound = new Audio('/flipCard.mp3');

export function ResultSharePage({}: ResultSharePageProps) {
  const [flipped, setFlipped] = useState<boolean>(false);
  const {
    data: { cardUrl, message },
  } = getResultShareQuery();

  const resultSharePageRef = useRef<HTMLDivElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth < 768;

  const flipCard = () => {
    setFlipped(true);
    flipSound.play();
  };

  return (
    <>
      <Header />
      <div
        ref={resultSharePageRef}
        className="w-h-full sm: display-medium16 surface-alt text-strong p-50"
      >
        <div
          ref={resultCardRef}
          className={`${isMobile && !flipped && 'animate-flappingCard'} ${
            flipped && 'animate-flippingCard'
          } relative top-[15vh] flex-with-center gap-40 sm:hover:scale-[1.1] sm:transition-transform`}
          style={{ transition: 'transform 1s ease-out', transformStyle: 'preserve-3d' }}
          onClick={() => isMobile && !flipped && flipCard()}
        >
          <div
            style={isMobile ? { backfaceVisibility: 'hidden' } : {}}
            className="result sm:absolute"
          >
            <ResultImage cardUrl={cardUrl} />
          </div>

          <div
            style={isMobile ? { backfaceVisibility: 'hidden', rotate: 'y 180deg' } : {}}
            className="relative w-664 h-500 sm:min-w-220 sm:w-220 sm:h-400 min-w-400 flex flex-col align-center rounded-2xl surface-box"
          >
            <ResultTextBox content={message} />
            <div className="md:absolute md:-bottom-100 md:w-full">
              <ShareButtonList
                isMobile={isMobile}
                cardUrl={cardUrl}
                resultSharePageRef={resultSharePageRef}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
