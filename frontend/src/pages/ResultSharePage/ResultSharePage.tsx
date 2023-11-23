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
        className="w-screen h-full flex flex-with-center gap-80 display-medium16 surface-alt text-strong p-20"
      >
        <ResultImage cardUrl={cardUrl} />

        <div className="w-664 h-640 flex flex-col rounded-2xl surface-box">
          <ResultTextBox content={message} />
          <ShareButtonList
            cardUrl={cardUrl}
            resultSharePageRef={resultSharePageRef}
          />
        </div>
      </div>
    </>
  );
}

export default ResultSharePage;
