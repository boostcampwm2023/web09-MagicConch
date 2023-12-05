import { ChangeEvent, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import ProfileSetting from '@components/ProfileSetting';

import { useProfileInfoContext } from '@business/hooks/useProfileInfoContext';
import { HumanSocketManager } from '@business/services/SocketManager';

import { arrayBuffer2Array } from '@utils/array';

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
    profileChannel,
    nicknameChannel,
  }: OutletContext = useOutletContext();

  const camList = cameraOptions.map(({ deviceId, label }) => ({ label, value: deviceId }));
  const micList = audioOptions.map(({ deviceId, label }) => ({ label, value: deviceId }));

  useEffect(() => {
    if (!socketManager.connected) {
      navigate('..');
    }
    getMedia({});
  }, []);

  const {
    setMyNickname,
    setMyProfileImage,
    profileInfos: { myNickname, myProfile },
  } = useProfileInfoContext();
  const setLocalProfileImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    setMyProfileImage(arrayBuffer, file.type);
  };

  const setLocalNickname = (e: ChangeEvent<HTMLInputElement>) => {
    setMyNickname(e.target.value);
  };

  const sendProfileInfoWithNavigate = () => {
    if (profileChannel.current?.readyState === 'open' && myProfile) {
      const dataArray = arrayBuffer2Array(myProfile.arrayBuffer);
      const sendJson = JSON.stringify({ arrayBuffer: dataArray, type: myProfile.type });

      profileChannel.current?.send?.(sendJson);
    }

    if (nicknameChannel.current?.readyState === 'open' && myNickname) {
      nicknameChannel.current?.send?.(myNickname);
    }

    navigate('..');
  };

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
      onConfirm={sendProfileInfoWithNavigate}
      onChangeProfileImage={setLocalProfileImage}
      onChangeNickname={setLocalNickname}
    />
  );
}
