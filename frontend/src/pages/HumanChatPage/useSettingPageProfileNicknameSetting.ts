import { ChangeEvent } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { useProfileInfo } from '@stores/zustandStores/useProfileInfo';

import { arrayBuffer2Array } from '@utils/array';

import { OutletContext } from './HumanChatPage';

export function useSettingPageProfileNicknameSetting() {
  const { profileChannel, nicknameChannel, setChatPageState }: OutletContext = useOutletContext();
  const navigate = useNavigate();

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

  const sendProfileInfoWithNavigateBefore = () => {
    if (profileChannel.current?.readyState === 'open' && myProfile) {
      const dataArray = arrayBuffer2Array(myProfile.arrayBuffer);
      const sendJson = JSON.stringify({ arrayBuffer: dataArray, type: myProfile.type });

      profileChannel.current?.send?.(sendJson);
    }

    if (nicknameChannel.current?.readyState === 'open' && myNickname) {
      nicknameChannel.current?.send?.(myNickname);
    }

    setChatPageState(prev => ({ ...prev, joined: true }));

    navigate('..');
  };

  return { setLocalProfileImage, setLocalNickname, sendProfileInfoWithNavigateBefore };
}
