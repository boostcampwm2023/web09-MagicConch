import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import ProfileSetting from '@components/ProfileSetting';

import { useControllMedia, useStreamVideoRef } from '@business/hooks/useWebRTC/';
import { HumanSocketManager } from '@business/services/SocketManager';

import { useSideBarStore } from '@stores/zustandStores/useSideBarStore';

import { useSettingPageMediaOptinos } from './useSettingPageMediaOptions';
import { useSettingPageProfileNicknameSetting } from './useSettingPageProfileNicknameSetting';

export default function ChattingPage() {
  const socketManager = HumanSocketManager.getInstance();

  const navigate = useNavigate();

  const { localVideoRef } = useStreamVideoRef();

  const { changeMyAudioTrack, changeMyVideoTrack, toggleAudio, toggleVideo } = useControllMedia({ localVideoRef });

  const { enableSideBar, disableSideBarButton } = useSideBarStore();

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
        enableSideBar();
        navigate('..');
      }}
      onChangeProfileImage={setLocalProfileImage}
      onChangeNickname={setLocalNickname}
    />
  );
}
