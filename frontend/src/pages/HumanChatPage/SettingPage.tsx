import { ChangeEvent, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import ProfileSetting from '@components/ProfileSetting';

import { HumanSocketManager } from '@business/services/SocketManager';

import type { OutletContext } from './HumanChatPage';

export default function ChattingPage() {
  const socketManager = new HumanSocketManager();

  const navigate = useNavigate();

  const {
    localVideoRef,
    toggleVideo,
    toggleAudio,
    mediaInfos,
    cameraOptions,
    audioOptions,
    changeMyVideoTrack,
    changeMyAudioTrack,
    getMedia,
  }: OutletContext = useOutletContext();

  const camList = cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }));
  const micList = audioOptions.map(({ deviceId, label }) => ({ label, value: deviceId }));

  useEffect(() => {
    if (!socketManager.connected) {
      navigate('..');
    }
    getMedia({});
  }, []);

  const sendImage = (e: ChangeEvent<HTMLInputElement>) => {};

  return (
    <ProfileSetting
      toggleVideo={toggleVideo}
      toggleAudio={toggleAudio}
      cameraConnected={{ local: mediaInfos.myVideoOn, remote: mediaInfos.remoteVideoOn }}
      audioConnected={{ local: mediaInfos.myMicOn, remote: mediaInfos.remoteMicOn }}
      changeMyCamera={changeMyVideoTrack}
      changeMyAudio={changeMyAudioTrack}
      camList={camList}
      micList={micList}
      videoRef={localVideoRef}
      onConfirm={() => navigate('..')}
      onChangeProfileImage={sendImage}
    />
  );
}
