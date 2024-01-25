import WebRTC from '@business/services/WebRTC';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';
import { useProfileInfo } from '@stores/zustandStores/useProfileInfo';

import {
  sendMyNickname,
  sendMyProfileImage,
  sendNowMediaStates,
  setMediaStates,
  setRemoteNicknameState,
  setRemoteProfileImageState,
} from './useDataChannel.eventListeners';

export function useDataChannel() {
  const { setRemoteMicOn, setRemoteVideoOn } = useMediaInfo(state => ({
    setRemoteMicOn: state.setRemoteMicOn,
    setRemoteVideoOn: state.setRemoteVideoOn,
  }));
  const { myNickname, myProfile, setRemoteNickname, setRemoteProfileImage } = useProfileInfo(state => ({
    setRemoteNickname: state.setRemoteNickname,
    setRemoteProfileImage: state.setRemoteProfile,
    myNickname: state.myNickname,
    myProfile: state.myProfile,
  }));
  const webRTC = WebRTC.getInstance();

  const initMediaInfoChannel = () => {
    const mediaInfoChannel = webRTC.addDataChannel('mediaInfoChannel');

    mediaInfoChannel?.addEventListener('message', ev => setMediaStates({ ev, setRemoteMicOn, setRemoteVideoOn }));

    mediaInfoChannel?.addEventListener('open', sendNowMediaStates);
  };

  const initChatChannel = () => {
    webRTC.addDataChannel('chatChannel');
  };

  const initProfileChannel = () => {
    const profileChannel = webRTC.addDataChannel('profileChannel');

    profileChannel?.addEventListener('message', ev => setRemoteProfileImageState({ ev, setRemoteProfileImage }));

    profileChannel?.addEventListener('open', sendMyProfileImage.bind(profileChannel, { myProfile }));
  };

  const initNicknameChannel = () => {
    const nicknameChannel = webRTC.addDataChannel('nicknameChannel');

    nicknameChannel?.addEventListener('message', ev => setRemoteNicknameState({ ev, setRemoteNickname }));

    nicknameChannel?.addEventListener('open', sendMyNickname.bind(nicknameChannel, { myNickname }));
  };

  const initDataChannels = () => {
    initMediaInfoChannel();
    initChatChannel();
    initProfileChannel();
    initNicknameChannel();
  };

  return { initDataChannels, dataChannels: webRTC.getDataChannels() };
}
