import WebRTC from '../../services/WebRTC';
import { useEffect } from 'react';

import { initSignalingSocket } from '@business/services/Socket';

import { useDataChannel } from './useDataChannel';
import { useMedia } from './useMedia';

export default function useWebRTC() {
  const webRTC = WebRTC.getInstace();

  const { getLocalStream } = useMedia();

  const { initDataChannels } = useDataChannel();

  const startWebRTC = async ({ roomName }: { roomName: string }) => {
    if (webRTC.isConnectedPeerConnection()) {
      return;
    }

    const stream = await getLocalStream();
    webRTC.setLocalStream(stream);

    initSignalingSocket({
      roomName,
      onExitUser: () => {
        webRTC.closeRTCPeerConnection();
        webRTC.closeDataChannels();
        webRTC.connectRTCPeerConnection(roomName);
        initDataChannels();
        webRTC.addTracks();
      },
    });

    webRTC.connectRTCPeerConnection(roomName);
    initDataChannels();
    webRTC.addTracks();
  };

  useEffect(() => {
    return () => {
      webRTC.closeRTCPeerConnection();
      webRTC.closeDataChannels();
    };
  }, []);

  return {
    startWebRTC,
  };
}
