import { ChangeEvent } from 'react';

import { useDataChannel } from '@business/hooks/useWebRTC';

import { useHumanChatPage } from '@stores/zustandStores/useHost';
import { useProfileInfo } from '@stores/zustandStores/useProfileInfo';

import { arrayBuffer2Array } from '@utils/array';

export function useSettingPageProfileNicknameSetting() {
  const { setJoined } = useHumanChatPage(stat => ({ setJoined: stat.setJoined }));

  const { dataChannels } = useDataChannel();
  const profileChannel = dataChannels.get('profileChannel');
  const nicknameChannel = dataChannels.get('nicknameChannel');

  const { myNickname, myProfile, setMyNickname, setMyProfileImage } = useProfileInfo(state => ({
    setMyNickname: state.setMyNickname,
    setMyProfileImage: state.setMyProfile,
    myNickname: state.myNickname,
    myProfile: state.myProfile,
  }));

  const setLocalProfileImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const { type } = file;

    const arrayBuffer = await file.arrayBuffer();
    setMyProfileImage({ arrayBuffer, type });
  };

  const setLocalNickname = (e: ChangeEvent<HTMLInputElement>) => {
    setMyNickname(e.target.value);
  };

  const sendProfileInfo = () => {
    if (profileChannel?.readyState === 'open' && myProfile) {
      const dataArray = arrayBuffer2Array(myProfile.arrayBuffer);
      const sendJson = JSON.stringify({ arrayBuffer: dataArray, type: myProfile.type });

      profileChannel?.send?.(sendJson);
    }

    if (nicknameChannel?.readyState === 'open' && myNickname) {
      nicknameChannel?.send?.(myNickname);
    }

    setJoined(true);
  };

  return { setLocalProfileImage, setLocalNickname, sendProfileInfo };
}
