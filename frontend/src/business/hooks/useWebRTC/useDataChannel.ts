import WebRTC from '@business/services/WebRTC';

import { useDataChannelEventListener } from './useDataChannelEventListener';

export function useDataChannel() {
  const webRTC = WebRTC.getInstance();
  const {
    sendMyNickname,
    sendMyProfileImage,
    sendNowMediaStates,
    setMediaStates,
    setRemoteNicknameState,
    setRemoteProfileImageState,
  } = useDataChannelEventListener();

  const initMediaInfoChannel = () => {
    const mediaInfoChannel = webRTC.addDataChannel('mediaInfoChannel');

    mediaInfoChannel?.addEventListener('message', ev => setMediaStates({ ev }));

    mediaInfoChannel?.addEventListener('open', sendNowMediaStates);
  };

  const initChatChannel = () => {
    webRTC.addDataChannel('chatChannel');
  };

  const initProfileChannel = () => {
    const profileChannel = webRTC.addDataChannel('profileChannel');

    profileChannel?.addEventListener('message', ev => setRemoteProfileImageState({ ev }));

    profileChannel?.addEventListener('open', sendMyProfileImage.bind(profileChannel));
  };

  const initNicknameChannel = () => {
    const nicknameChannel = webRTC.addDataChannel('nicknameChannel');

    nicknameChannel?.addEventListener('message', ev => setRemoteNicknameState({ ev }));

    nicknameChannel?.addEventListener('open', sendMyNickname.bind(nicknameChannel));
  };

  const initDataChannels = () => {
    initMediaInfoChannel();
    initChatChannel();
    initProfileChannel();
    initNicknameChannel();
  };

  return { initDataChannels, dataChannels: webRTC.getDataChannels() };
}
