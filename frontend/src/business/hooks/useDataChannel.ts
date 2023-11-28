import { useRef } from 'react';

import { useMediaInfoContext } from './useMediaInfoContext';

interface useDataChannelProps {
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
}
export function useDataChannel({ peerConnectionRef }: useDataChannelProps) {
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
    chatChannel.current = peerConnectionRef.current?.createDataChannel('chat');

    mediaInfoChannel.current?.addEventListener('message', ({ data }) => {
      const mediaInfoArray = JSON.parse(data);

      mediaInfoArray.forEach(({ type, onOrOff }: { type: string; onOrOff: boolean }) => {
        console.log(mediaInfoArray);
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

  return { mediaInfoChannel, chatChannel, initDataChannels };
}
