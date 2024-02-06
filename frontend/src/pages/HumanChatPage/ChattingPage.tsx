import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { IconButton } from '@components/common/Buttons';
import { CamContainer } from '@components/humanChatPage';

import { useControllMedia, useStreamVideoRef } from '@business/hooks/webRTC';

import type { OutletContext } from './HumanChatPage';
import { useCreateJoinRoomPasswordPopup } from './hooks';

export function ChattingPage() {
  const { tarotButtonDisabled, tarotButtonClick, unblockGoBack, joinedRoom } = useOutletContext<OutletContext>();

  useCreateJoinRoomPasswordPopup({ unblockGoBack });
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
      <>
        <div className={`flex-with-center w-h-full`}>
          <CamContainer
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            tarotButtonClick={tarotButtonClick}
            tarotButtonDisabled={tarotButtonDisabled}
          />
        </div>
        <div className="fixed z-30 top-[10vh] right-90">
          <IconButton
            icon="uil:setting"
            iconColor="textWhite"
            buttonColor="cancel"
            onClick={goSettingPage}
          />
        </div>
      </>
    )
  );
}
