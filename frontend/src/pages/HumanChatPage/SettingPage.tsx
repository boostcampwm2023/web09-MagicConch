import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileSetting } from '@components/humanChatPage';

import { HumanSocketManager } from '@business/services/SocketManager';

import { useMediaOptinos } from './hooks';
import { useProfileNicknameSetting } from './hooks';

export function SettingPage() {
  const socketManager = HumanSocketManager.getInstance();

  const navigate = useNavigate();

  useEffect(() => {
    if (!socketManager.connected) {
      navigate('..');
    }
  }, []);

  const { setLocalNickname, setLocalProfileImage, sendProfileInfo } = useProfileNicknameSetting();

  const { mediaOptions } = useMediaOptinos();

  return (
    <ProfileSetting
      camList={mediaOptions.video}
      micList={mediaOptions.audio}
      onConfirm={() => {
        sendProfileInfo();
        navigate('..');
      }}
      onChangeProfileImage={setLocalProfileImage}
      onChangeNickname={setLocalNickname}
    />
  );
}
