import { useDataChannel, useMedia } from '.';

import { WebRTC } from '@business/services';
import { initSignalingSocket } from '@business/services';
import { HumanSocketManager } from '@business/services/SocketManager';

export function useWebRTC() {
  const humanSocket = HumanSocketManager.getInstance();
  const webRTC = WebRTC.getInstance(humanSocket);

  const { getLocalStream } = useMedia();

  const { initDataChannels } = useDataChannel();

  const startWebRTC = async ({ roomName }: { roomName: string }) => {
    if (webRTC.isConnectedPeerConnection()) {
      return false;
    }
    const stream = await getLocalStream();
    webRTC.setLocalStream(stream);

    initSignalingSocket({
      roomName,
      onExitUser: () => resetWebRTCDataChannel(webRTC, initDataChannels, roomName),
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

export function resetWebRTCDataChannel(webRTC: WebRTC, initDataChannels: () => void, roomName: string) {
  webRTC.closeRTCPeerConnection();
  webRTC.closeDataChannels();
  webRTC.connectRTCPeerConnection(roomName);
  initDataChannels();
  webRTC.addTracks();
}
