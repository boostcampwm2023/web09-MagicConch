import { useRef } from 'react';

import { array2ArrayBuffer } from '@utils/array';

import { useMediaInfoContext } from './useMediaInfoContext';
import { useProfileInfoContext } from './useProfileInfoContext';

interface useDataChannelProps {
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
}
export function useDataChannel({ peerConnectionRef }: useDataChannelProps) {
  const {
    mediaInfos: { myMicOn, myVideoOn },
    setRemoteMicOn,
    setRemoteVideoOn,
  } = useMediaInfoContext();

  const {
    setRemoteNickname,
    setRemoteProfileImage,
    profileInfos: { myNickname, myProfile },
  } = useProfileInfoContext();

  const mediaInfoChannel = useRef<RTCDataChannel>();
  const chatChannel = useRef<RTCDataChannel>();
  const profileChannel = useRef<RTCDataChannel>();
  const nicknameChannel = useRef<RTCDataChannel>();

  const initMediaInfoChannel = () => {
    mediaInfoChannel.current = peerConnectionRef.current?.createDataChannel('mediaInfoChannel', {
      negotiated: true,
      id: 0,
    });

    mediaInfoChannel.current?.addEventListener('message', ({ data }) => {
      const mediaInfoArray = JSON.parse(data);

      mediaInfoArray.forEach(({ type, onOrOff }: { type: string; onOrOff: boolean }) => {
        if (type === 'audio') {
          setRemoteMicOn(onOrOff);
        } else if (type === 'video') {
          setRemoteVideoOn(onOrOff);
        }
      });
    });

    mediaInfoChannel.current?.addEventListener('open', () => {
      mediaInfoChannel.current?.send(
        JSON.stringify([
          { type: 'audio', onOrOff: myMicOn },
          { type: 'video', onOrOff: myVideoOn },
        ]),
      );
    });
  };

  const initChatChannel = () => {
    chatChannel.current = peerConnectionRef.current?.createDataChannel('chat', {
      negotiated: true,
      id: 1,
    });
  };

  const initProfileChannel = () => {
    profileChannel.current = peerConnectionRef.current?.createDataChannel('profile', {
      negotiated: true,
      id: 2,
    });

    if (!profileChannel.current) {
      return;
    }

    profileChannel.current.addEventListener('message', ({ data }) => {
      const receivedData = JSON.parse(data);

      const { type, arrayBuffer } = receivedData;

      const receivedArrayBuffer = array2ArrayBuffer(arrayBuffer);

      setRemoteProfileImage(receivedArrayBuffer, type);
    });

    profileChannel.current?.addEventListener('open', () => {
      profileChannel.current?.send?.(JSON.stringify({ myProfile }));
    });
  };

  const initNicknameChannel = () => {
    nicknameChannel.current = peerConnectionRef.current?.createDataChannel('nickname', {
      negotiated: true,
      id: 3,
    });

    nicknameChannel.current?.addEventListener('message', ({ data }) => {
      setRemoteNickname(data);
    });

    nicknameChannel.current?.addEventListener('open', () => {
      if (!myNickname) {
        return;
      }
      nicknameChannel.current?.send?.(myNickname);
    });
  };

  const initDataChannels = () => {
    initMediaInfoChannel();
    initChatChannel();
    initProfileChannel();
    initNicknameChannel();
  };

  const closeDataChannels = () => {
    mediaInfoChannel.current?.close();
    chatChannel.current?.close();
  };

  return { mediaInfoChannel, chatChannel, profileChannel, nicknameChannel, initDataChannels, closeDataChannels };
}
