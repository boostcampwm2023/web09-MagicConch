import { useDataChannel } from '.';

import { WebRTC } from '@business/services';
import { initSignalingSocket } from '@business/services';
import { HumanSocketManager } from '@business/services/SocketManager';

import { useMediaStreamStore } from '@stores/zustandStores';

export function useWebRTC() {
  const humanSocket = HumanSocketManager.getInstance();
  const webRTC = WebRTC.getInstance(humanSocket);

  const { initDataChannels } = useDataChannel();

  const { localStream, setRemoteStream } = useMediaStreamStore(state => ({
    localStream: state.localStream,
    setRemoteStream: state.setRemoteStream,
  }));

  const resetWebRTCDataChannel = (roomName: string) => {
    webRTC.closeRTCPeerConnection();
    webRTC.closeDataChannels();
    webRTC.connectRTCPeerConnection({ roomName, onTrack: e => setRemoteStream(e.streams[0]) });
    initDataChannels();
    localStream.getTracks().forEach(track => {
      webRTC.addTrack2PeerConnection(localStream, track);
    });
  };

  const startWebRTC = async ({ roomName }: { roomName: string }) => {
    if (webRTC.isConnectedPeerConnection()) {
      return false;
    }

    initSignalingSocket({
      roomName,
      onExitUser: () => resetWebRTCDataChannel(roomName),
    });

    webRTC.connectRTCPeerConnection({
      roomName,
      onTrack: e => setRemoteStream(e.streams[0]),
    });

    initDataChannels();
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
