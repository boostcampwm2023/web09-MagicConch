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
    mediaInfos,
    cameraOptions,
    // changeCamera,
    changeMyVideoTrack,
    getMedia,
  }: OutletContext = useOutletContext();

  const camList = cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }));

  useEffect(() => {
    getMedia({});
  }, []);

  return (
    <ProfileSetting
      toggleVideo={toggleVideo}
      toggleAudio={toggleAudio}
      cameraConnected={{ local: mediaInfos.myVideoOn, remote: mediaInfos.remoteVideoOn }}
      changeMyCamera={changeMyVideoTrack}
      camList={camList}
      videoRef={localVideoRef}
      onConfirm={() => navigate('..')}
    />
  );
}
