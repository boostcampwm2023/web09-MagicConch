import { Suspense } from 'react';

import CustomButton from '@components/CustomButton';

import { useOverflowTextBoxCenter } from '@business/hooks/useOverflowTextBoxCenter';
import { useShareButtons } from '@business/hooks/useShareButtons';

import { getResultShareQuery } from '@stores/queries/getResultShareQuery';

import { Icon } from '@iconify/react';

interface ResultSharePageProps {}

const ICON_SIZE = 20;

function ResultSharePage({}: ResultSharePageProps) {
  const { data } = getResultShareQuery();

  const { textBoxRef } = useOverflowTextBoxCenter();

  const { shareButtons } = useShareButtons({ card_url: data.card_url });

  return (
    <Suspense fallback={<div>loading...</div>}>
      <div className="w-screen h-full flex flex-all-center gap-80 display-medium16 surface-alt text-strong p-20 ">
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

          <ul className="w-full h-110 rounded-b-2xl flex flex-all-center gap-12">
            {shareButtons.map(({ id, name, icon, color, handler }) => (
              <li key={id}>
                <CustomButton
                  key={id}
                  size="m"
                  color="cancel"
                  handleButtonClicked={handler}
                >
                  <Icon
                    icon={icon}
                    color={color}
                    fontSize={ICON_SIZE}
                  />
                  <span>{name}</span>
                </CustomButton>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Suspense>
  );
}

export default ResultSharePage;
