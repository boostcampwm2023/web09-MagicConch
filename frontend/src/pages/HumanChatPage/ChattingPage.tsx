import { useNavigate, useOutletContext } from 'react-router-dom';

import { IconButton } from '@components/common/Buttons';
import { DocumentBodyPortal } from '@components/common/Portals';
import { CamContainer } from '@components/humanChatPage';

import type { OutletContext } from './HumanChatPage';
import { useCreateJoinRoomPasswordPopup } from './hooks';

export function ChattingPage() {
  const { tarotButtonDisabled, tarotButtonClick, unblockGoBack, joinedRoom } = useOutletContext<OutletContext>();

  useCreateJoinRoomPasswordPopup({ unblockGoBack });

  const navigate = useNavigate();
  const goSettingPage = () => navigate('setting');

  return (
    joinedRoom && (
      <>
        <div className={`flex-with-center w-h-full`}>
          <CamContainer
            tarotButtonClick={tarotButtonClick}
            tarotButtonDisabled={tarotButtonDisabled}
          />
        </div>
        <DocumentBodyPortal>
          <div className="fixed top-[10vh] right-90">
            <IconButton
              icon="uil:setting"
              iconColor="textWhite"
              buttonColor="cancel"
              onClick={goSettingPage}
            />
          </div>
        </DocumentBodyPortal>
      </>
    )
  );
}
