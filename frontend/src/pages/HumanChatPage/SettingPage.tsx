import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileSetting } from '@components/humanChatPage';

import { useControllMedia, useStreamVideoRef } from '@business/hooks/webRTC';
import { HumanSocketManager } from '@business/services/SocketManager';

import { useSideBarStore } from '@stores/zustandStores';

import { useMediaOptinos } from './hooks';
import { useProfileNicknameSetting } from './hooks';

export function SettingPage() {
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

  const { setLocalNickname, setLocalProfileImage, sendProfileInfo } = useProfileNicknameSetting();

  const { mediaOptions } = useMediaOptinos();

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
