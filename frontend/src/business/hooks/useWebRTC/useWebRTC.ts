import { initSignalingSocket } from '@business/services/Socket';
import { HumanSocketManager } from '@business/services/SocketManager';
import WebRTC from '@business/services/WebRTC';

import { useDataChannel } from './useDataChannel';
import { useMedia } from './useMedia';

export default function useWebRTC() {
  const webRTC = WebRTC.getInstace();
  const humanSocket = HumanSocketManager.getInstance();

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

  const endWebRTC = () => {
    webRTC.closeRTCPeerConnection();
    webRTC.closeDataChannels();
    humanSocket.disconnect();
  };

  return {
    startWebRTC,
    endWebRTC,
  };
}
