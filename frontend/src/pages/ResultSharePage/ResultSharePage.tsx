import { useRef } from 'react';

import Header from '@components/Header';

import { getResultShareQuery } from '@stores/queries/getResultShareQuery';

import { ResultImage } from './ResultImage';
import { ResultTextBox } from './ResultTextBox';
import { ShareButtonList } from './ShareButtonList';

interface ResultSharePageProps {}

function ResultSharePage({}: ResultSharePageProps) {
  const {
    data: { cardUrl, message },
  } = getResultShareQuery();

  const resultSharePageRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Header />
      <div
        ref={resultSharePageRef}
        className="relative top-48 w-screen h-[calc(100vh-48px)] flex flex-with-center gap-40 display-medium16 surface-alt text-strong p-50"
      >
        <ResultImage cardUrl={cardUrl} />
        <div className="relative w-664 h-500 min-w-400 min-h-450 flex flex-col rounded-2xl surface-box">
          <ResultTextBox content={message} />
          <div className="md:absolute md:-bottom-100 md:w-full">
            <ShareButtonList
              cardUrl={cardUrl}
              resultSharePageRef={resultSharePageRef}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultSharePage;
