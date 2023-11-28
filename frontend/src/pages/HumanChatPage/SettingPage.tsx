import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import ProfileSetting from '@components/ProfileSetting';

import type { OutletContext } from './HumanChatPage';

export default function ChattingPage() {
  const navigate = useNavigate();

  const {
    localVideoRef,
    toggleVideo,
    toggleAudio,
    cameraConnected,
    cameraOptions,
    changeCamera,
    changeVideoTrack,
    getMedia,
  }: OutletContext = useOutletContext();

  const camList = cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }));
  const changeMyCamera = async (deviceId: string) => {
    await changeCamera(deviceId);
    changeVideoTrack();
  };

  useEffect(() => {
    getMedia();
  }, []);

  return (
    <ProfileSetting
      toggleVideo={toggleVideo}
      toggleAudio={toggleAudio}
      cameraConnected={cameraConnected}
      changeMyCamera={changeMyCamera}
      camList={camList}
      videoRef={localVideoRef}
      onConfirm={() => navigate('..')}
    />
  );
}
