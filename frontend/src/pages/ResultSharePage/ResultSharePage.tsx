import { shareUrlMock, shareUrlMockUrl } from '../../../__tests__/mocks/resultShareMocks/resultShareMock';
import { Icon } from '@iconify/react';

import CustomButton from '@components/CustomButton';

import { useOverflowTextBoxCenter } from '@/business/hooks/useOverflowTextBoxCenter';

import { shareButtons } from '@/constants/shareButtons';

interface ResultSharePageProps {}

// TODO: API 연결되면 제거
const mockUrl = '../../../__tests__/mocks/cards';
const ICON_SIZE = 25;

function ResultSharePage({}: ResultSharePageProps) {
  // TODO: param에서 id를 가져오도록 수정해야함.
  const { imageId, text } = shareUrlMock[shareUrlMockUrl];

  const { textBoxRef } = useOverflowTextBoxCenter();

  return (
    <>
      <div className="w-screen h-full flex flex-all-center gap-80 display-medium16 surface-alt text-strong p-20 ">
        <div className="w-384 h-640 rounded-2xl flex flex-all-center">
          <img
            className="rounded-2xl"
            src={`${mockUrl}/${imageId.padStart(2, '0')}.jpg`}
          />
        </div>

        <div className="w-664 h-640 flex flex-col rounded-2xl surface-box">
          <div
            ref={textBoxRef}
            className="w-full flex-1 flex justify-center rounded-2xl items-center overflow-auto border-t-50 border-transparent px-70"
          >
            {text}
          </div>

          <ul className="w-full h-110 rounded-b-2xl flex flex-all-center gap-12">
            {shareButtons.map(({ id, icon, color }) => (
              <li>
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
    </>
  );
}

export default ResultSharePage;
