import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ProfileSetting from '@components/ProfileSetting';

import { useControllMedia, useStreamVideoRef } from '@business/hooks/useWebRTC/';
import { HumanSocketManager } from '@business/services/SocketManager';

import { useSideBarStore } from '@stores/zustandStores/useSideBarStore';

import { useSettingPageMediaOptinos } from './useSettingPageMediaOptions';
import { useSettingPageProfileNicknameSetting } from './useSettingPageProfileNicknameSetting';

export default function SettingPage() {
  const socketManager = HumanSocketManager.getInstance();

  const navigate = useNavigate();

  const { localVideoRef } = useStreamVideoRef();

  const { changeMyAudioTrack, changeMyVideoTrack, toggleAudio, toggleVideo } = useControllMedia({ localVideoRef });

  const { enableSideBarButton, disableSideBarButton } = useSideBarStore();

  useEffect(() => {
    disableSideBarButton();
    if (!socketManager.connected) {
      navigate('..');
    }

    changeMyVideoTrack();
  }, []);

  const { setLocalNickname, setLocalProfileImage, sendProfileInfo } = useSettingPageProfileNicknameSetting();

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
        sendProfileInfo();
        enableSideBarButton();
        navigate('..');
      }}
      onChangeProfileImage={setLocalProfileImage}
      onChangeNickname={setLocalNickname}
    />
  );
}
