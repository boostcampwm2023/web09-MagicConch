import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import ProfileSetting from '@components/ProfileSetting';

import { HumanSocketManager } from '@business/services/SocketManager';

import type { OutletContext } from './HumanChatPage';
import { useSettingPageMediaOptinos } from './useSettingPageMediaOptions';
import { useSettingPageProfileNicknameSetting } from './useSettingPageProfileNicknameSetting';

export default function ChattingPage() {
  const socketManager = new HumanSocketManager();

  const navigate = useNavigate();

  const {
    localVideoRef,
    toggleVideo,
    toggleAudio,
    changeMyVideoTrack,
    changeMyAudioTrack,
    enableSideBar,
    disableSideBar,
  }: OutletContext = useOutletContext();

  useEffect(() => {
    disableSideBar();
    if (!socketManager.connected) {
      navigate('..');
    }

    changeMyVideoTrack();
  }, []);

  const { setLocalNickname, setLocalProfileImage, sendProfileInfoWithNavigateBefore } =
    useSettingPageProfileNicknameSetting();

  const { mediaOptions } = useSettingPageMediaOptinos();

  return (
    <ProfileSetting
      toggleVideo={toggleVideo}
      toggleAudio={toggleAudio}
      changeMyCamera={changeMyVideoTrack}
      changeMyAudio={changeMyAudioTrack}
      camList={mediaOptions.video}
      micList={mediaOptions.audio}
      videoRef={localVideoRef}
      onConfirm={() => {
        sendProfileInfoWithNavigateBefore();
        enableSideBar();
      }}
      onChangeProfileImage={setLocalProfileImage}
      onChangeNickname={setLocalNickname}
    />
  );
}
