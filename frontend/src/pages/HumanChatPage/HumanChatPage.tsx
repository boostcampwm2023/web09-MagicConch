import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Background from '@components/Background';
import CamContainer from '@components/CamContainer';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';
import ProfileSetting from '@components/ProfileSetting';
import SideBar from '@components/SideBar';

import useOverlay from '@business/hooks/useOverlay';
import { useWebRTC } from '@business/hooks/useWebRTC';

export default function HumanChatPage() {
  const { roomName } = useParams();
  const { open } = useOverlay();
  const [setting, setSetting] = useState(false);

  const {
    cameraOptions,
    localVideoRef,
    remoteVideoRef,
    toggleAudio,
    toggleVideo,
    changeCamera,
    cameraConnected,
    changeVideoTrack,
  } = useWebRTC(roomName as string);

  const changeMyCamera = async (deviceId: string) => {
    await changeCamera(deviceId);
    changeVideoTrack();
  };

  const openProfileSetting = () => {
    setSetting(true);
    const camList = cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }));

    open(({ close }) => (
      <ProfileSetting
        close={() => {
          close();
          setSetting(false);
        }}
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        cameraConnected={cameraConnected}
        changeMyCamera={changeMyCamera}
        camList={camList}
        videoRef={localVideoRef}
      />
    ));
  };

  useEffect(() => openProfileSetting(), []);

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <SideBar key="chat-side-bar">
            <ChatContainer
              width="w-400"
              height="h-4/5"
              position="top-40"
            />
          </SideBar>,
        ]}
      />
      {!setting && (
        <CamContainer
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          cameraConnected={cameraConnected}
        />
      )}
    </Background>
  );
}
