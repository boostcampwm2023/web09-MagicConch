import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { IconButton } from '@components/Buttons';
import CamContainer from '@components/CamContainer';

import { useControllMedia, useStreamVideoRef } from '@business/hooks/useWebRTC';

import type { OutletContext } from './HumanChatPage';
import { useChattingPageCreateJoinRoomPasswordPopup } from './useChattingPageCreateJoinRoomPopup';

export function ChattingPage() {
  const { tarotButtonDisabled, tarotButtonClick, unblockGoBack, joinedRoom } = useOutletContext<OutletContext>();

  useChattingPageCreateJoinRoomPasswordPopup({ unblockGoBack });
  const { localVideoRef, remoteVideoRef } = useStreamVideoRef();
  const { toggleAudio, toggleVideo, changeMyVideoTrack } = useControllMedia({ localVideoRef });

  useEffect(() => {
    if (joinedRoom) {
      changeMyVideoTrack();
    }
  }, [joinedRoom]);

  useEffect(() => {
    if (!localVideoRef.current) {
      return;
    }
    localVideoRef.current.volume = 0;
  }, []);

  const navigate = useNavigate();
  const goSettingPage = () => navigate('setting');

  return (
    joinedRoom && (
      <div className={`flex-with-center`}>
        <CamContainer
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          tarotButtonClick={tarotButtonClick}
          tarotButtonDisabled={tarotButtonDisabled}
        />
        <div className="absolute z-10 top-[10vh] right-90">
          <IconButton
            icon="uil:setting"
            iconColor="textWhite"
            buttonColor="cancel"
            onClick={goSettingPage}
          />
        </div>
      </div>
    )
  );
}
