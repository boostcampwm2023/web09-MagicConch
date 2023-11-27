import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Background from '@components/Background';
import CustomButton from '@components/Buttons/CustomButton';
import CamContainer from '@components/CamContainer';
import Header from '@components/Header';
import ProfileSetting from '@components/ProfileSetting';

import useOverlay from '@business/hooks/useOverlay';
import { useWebRTC } from '@business/hooks/useWebRTC';

import { Icon } from '@iconify/react/dist/iconify.js';

export default function HumanChatPage() {
  const { roomName } = useParams();
  const { open } = useOverlay();

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
    open(({ close }) => (
      <ProfileSetting
        close={close}
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        cameraConnected={cameraConnected}
        changeMyCamera={changeMyCamera}
        camList={cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }))}
      />
    ));
  };

  useEffect(() => openProfileSetting(), []);

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <CustomButton
            color="transparent"
            circle
            key="side-panel-close"
          >
            <Icon
              className="text-25"
              icon="carbon:side-panel-close"
            />
          </CustomButton>,
        ]}
      />
      <CamContainer
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        cameraConnected={cameraConnected}
      />
    </Background>
  );
}
