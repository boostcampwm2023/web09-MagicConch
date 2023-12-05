import { useRef } from 'react';

import { useMediaInfoContext } from './useMediaInfoContext';

interface useDataChannelParams {
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
}
export function useDataChannel({ peerConnectionRef }: useDataChannelParams) {
  const {
    mediaInfos: { myMicOn, myVideoOn },
    setRemoteMicOn,
    setRemoteVideoOn,
  } = useMediaInfoContext();

  const mediaInfoChannel = useRef<RTCDataChannel>();
  const chatChannel = useRef<RTCDataChannel>();

  const initDataChannels = () => {
    mediaInfoChannel.current = peerConnectionRef.current?.createDataChannel('mediaInfoChannel', {
      negotiated: true,
      id: 0,
    });
    chatChannel.current = peerConnectionRef.current?.createDataChannel('chat', {
      negotiated: true,
      id: 1,
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

  const closeDataChannels = () => {
    mediaInfoChannel.current?.close();
    chatChannel.current?.close();
  };

  return { mediaInfoChannel, chatChannel, initDataChannels, closeDataChannels };
}
