import { Suspense } from 'react';
import { useParams } from 'react-router-dom';

import CustomButton from '@components/CustomButton';

import { useOverflowTextBoxCenter } from '@/business/hooks/useOverflowTextBoxCenter';

import { getResultShareQuery } from '@/stores/queries/getResultShareQuery';

import { shareButtons } from '@/constants/shareButtons';

import { Icon } from '@iconify/react';

interface ResultSharePageProps {}

const ICON_SIZE = 25;

function ResultSharePage({}: ResultSharePageProps) {
  const { id } = useParams();
  const { data } = getResultShareQuery(id as string);

  const { textBoxRef } = useOverflowTextBoxCenter();

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
            {shareButtons.map(({ id, icon, color }) => (
              <li key={id}>
                <CustomButton
                  key={id}
                  size="l"
                  color="cancel"
                >
                  {icon ? (
                    <Icon
                      icon={icon}
                      color={color}
                      fontSize={ICON_SIZE}
                    />
                  ) : (
                    id
                  )}
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
