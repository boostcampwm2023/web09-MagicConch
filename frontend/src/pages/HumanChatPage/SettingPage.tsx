import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import ProfileSetting from '@components/ProfileSetting';

import { HumanSocketManager } from '@business/services/SocketManager';

import type { OutletContext } from './HumanChatPage';
import { useSettingPageProfileNicknameSetting } from './useSettingPageProfileNicknameSetting';

export default function ChattingPage() {
  const socketManager = new HumanSocketManager();

  const navigate = useNavigate();

  const {
    localVideoRef,
    cameraOptions,
    audioOptions,
    toggleVideo,
    toggleAudio,
    changeMyVideoTrack,
    changeMyAudioTrack,
    getMedia,
  }: OutletContext = useOutletContext();

  useEffect(() => {
    if (!socketManager.connected) {
      navigate('..');
    }
    getMedia({});
  }, []);

  const camList = cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }));
  const micList = audioOptions.map(({ deviceId, label }) => ({ label, value: deviceId }));

  const { setLocalNickname, setLocalProfileImage, sendProfileInfoWithNavigateBefore } =
    useSettingPageProfileNicknameSetting();

  return (
    <ProfileSetting
      toggleVideo={toggleVideo}
      toggleAudio={toggleAudio}
      changeMyCamera={changeMyVideoTrack}
      changeMyAudio={changeMyAudioTrack}
      camList={camList}
      micList={micList}
      videoRef={localVideoRef}
      onConfirm={sendProfileInfoWithNavigateBefore}
      onChangeProfileImage={setLocalProfileImage}
      onChangeNickname={setLocalNickname}
    />
  );
}
