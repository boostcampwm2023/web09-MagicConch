import { Suspense } from 'react';

import IconButton from '@components/IconButton';

import { useOverflowTextBoxCenter } from '@business/hooks/useOverflowTextBoxCenter';
import { useResultSharePageButtonHandlers } from '@business/hooks/useResultSharePageButtonHandlers';

import { getResultShareQuery } from '@stores/queries/getResultShareQuery';

import { insertOnclick } from '@utils/insertOnclick';

import { RESULT_SHARE_ICON_SIZE, shareButtons } from '@constants/shareButtons';

interface ResultSharePageProps {}

function ResultSharePage({}: ResultSharePageProps) {
  const { data } = getResultShareQuery();

  const { textBoxRef } = useOverflowTextBoxCenter();

  const { handlers, resultSharePageRef } = useResultSharePageButtonHandlers(data.card_url);

  return (
    <Suspense fallback={<div>loading...</div>}>
      <div
        ref={resultSharePageRef}
        className="w-screen h-full flex flex-all-center gap-80 display-medium16 surface-alt text-strong p-20"
      >
        <div className="w-384 h-640 rounded-2xl flex flex-all-center">
          <img
            className="rounded-2xl"
            src={data.card_url}
          />
        </div>

        <div className="w-664 h-640 flex flex-col rounded-2xl surface-box">
          <div
            ref={textBoxRef}
            className="w-full flex-1 flex justify-center rounded-2xl items-center overflow-auto border-t-50 border-transparent px-70"
          >
            {data.content}
          </div>

          <ul className="w-full h-110 rounded-b-2xl flex flex-all-center gap-12 ignore-html2canvas">
            {shareButtons
              .map((button, idx) => insertOnclick(button, handlers[idx]))
              .map(({ id, text, icon, iconColor, onClick }) => (
                <IconButton
                  key={id}
                  id={id}
                  text={text}
                  icon={icon}
                  iconColor={iconColor}
                  onClick={onClick}
                  iconSize={RESULT_SHARE_ICON_SIZE}
                />
              ))}
          </ul>
        </div>
      </div>
    </Suspense>
  );
}

export default ResultSharePage;
