import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { IconButton } from '@components/Buttons';
import CamContainer from '@components/CamContainer';

import { useControllMedia, useStreamVideoRef } from '@business/hooks/useWebRTC';

import type { OutletContext } from './HumanChatPage';
import { useChattingPageCreateJoinRoomPasswordPopup } from './useChattingPageCreateJoinRoomPopup';

export default function ChattingPage() {
  const {
    tarotButtonDisabled,
    tarotButtonClick,
    chatPageState: { joined },
    unblockGoBack,
  }: OutletContext = useOutletContext();

  useChattingPageCreateJoinRoomPasswordPopup({ unblockGoBack });
  const { localVideoRef, remoteVideoRef } = useStreamVideoRef();
  const { toggleAudio, toggleVideo, changeMyVideoTrack } = useControllMedia({ localVideoRef });

  useEffect(() => {
    if (joined) {
      changeMyVideoTrack();
    }
  }, [joined]);

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
