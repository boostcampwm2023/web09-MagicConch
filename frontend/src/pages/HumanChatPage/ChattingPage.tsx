import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { IconButton } from '@components/Buttons';
import CamContainer from '@components/CamContainer';

import type { OutletContext } from './HumanChatPage';
import { useChattingPageChangeVideoTrackJoined } from './useChattingPageChangeVideoTrackJoined';
import { useChattingPageCreateJoinRoomPasswordPopup } from './useChattingPageCreateJoinRoomPopup';

export default function ChattingPage() {
  const {
    localVideoRef,
    remoteVideoRef,
    tarotButtonDisabled,
    toggleVideo,
    toggleAudio,
    tarotButtonClick,
    enableSideBar,
    chatPageState: { joined },
    unblockGoBack,
  }: OutletContext = useOutletContext();

  useChattingPageChangeVideoTrackJoined();
  useChattingPageCreateJoinRoomPasswordPopup({ unblockGoBack, enableSideBar });

  const navigate = useNavigate();
  const goSettingPage = () => navigate('setting');

  return (
    <div className={`${joined ? '' : 'hidden'}`}>
      <CamContainer
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        tarotButtonClick={tarotButtonClick}
        tarotButtonDisabled={tarotButtonDisabled}
      />
      <div className="absolute top-[10vh] right-90">
        <IconButton
          icon="uil:setting"
          iconColor="textWhite"
          buttonColor="cancel"
          onClick={goSettingPage}
        />
      </div>
    </div>
  );
}
