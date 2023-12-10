import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { IconButton } from '@components/Buttons';
import CamContainer from '@components/CamContainer';

import { useControllMedia } from '@business/hooks/useWebRTC/useControllMedia';
import WebRTC from '@business/services/WebRTC';

import type { OutletContext } from './HumanChatPage';
import { useChattingPageCreateJoinRoomPasswordPopup } from './useChattingPageCreateJoinRoomPopup';

export default function ChattingPage() {
  const {
    localVideoRef,
    remoteVideoRef,
    tarotButtonDisabled,
    tarotButtonClick,
    enableSideBar,
    chatPageState: { joined },
    unblockGoBack,
  }: OutletContext = useOutletContext();

  const { toggleAudio, toggleVideo, changeMyVideoTrack } = useControllMedia({ localVideoRef });
  const webRTC = WebRTC.getInstace();

  useEffect(() => {
    if (joined) {
      changeMyVideoTrack();
    }
  }, [joined]);

  useEffect(() => {
    if (
      !remoteVideoRef.current ||
      !webRTC.remoteStream ||
      (remoteVideoRef.current.srcObject as MediaStream)?.id === webRTC.remoteStream?.id
    ) {
      return;
    }

    remoteVideoRef.current.srcObject = webRTC.remoteStream as MediaStream;
  }, [remoteVideoRef.current]);

  // useEffect(() => {
  //   if (!remoteVideoRef.current || !webRTC.remoteStream) {
  //     return;
  //   }
  //   remoteVideoRef.current.srcObject = webRTC.remoteStream as MediaStream;
  // }, [webRTC.remoteStream?.id, remoteVideoRef.current]);

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
