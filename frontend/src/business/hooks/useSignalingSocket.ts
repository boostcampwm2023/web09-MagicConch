import { useSocket } from './useSocket';

interface useSignalingSocketProps {
  // roomName: string;
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
  negotiationDataChannels: ({ roomName }: { roomName: string }) => void;
}

export function useSignalingSocket({ peerConnectionRef, negotiationDataChannels }: useSignalingSocketProps) {
  const { connectSocket, socketEmit, socketOn } = useSocket('WebRTC');

  const initSignalingSocket = ({ roomName }: { roomName: string }) => {
    connectSocket(import.meta.env.VITE_HUMAN_SOCKET_URL);

    socketOn('welcome', (users: { id: string }[]) => {
      if (users.length > 0) {
        createOffer({ roomName });
      }
    });

    socketOn('offer', (sdp: RTCSessionDescription) => {
      createAnswer({ roomName, sdp });
    });

    socketOn('answer', async (sdp: RTCSessionDescription) => {
      await peerConnectionRef.current?.setRemoteDescription(sdp);
    });

    socketOn('candidate', async (candidate: RTCIceCandidate) => {
      await peerConnectionRef.current?.addIceCandidate(candidate);
    });

    socketOn('roomFull', () => {
      alert('room is full');
    });

    socketOn('userExit', async () => {
      negotiationDataChannels({ roomName });
    });
  };

  const createOffer = async ({ roomName }: { roomName: string }) => {
    const sdp = await peerConnectionRef.current?.createOffer();
    peerConnectionRef.current?.setLocalDescription(sdp);
    socketEmit('offer', sdp, roomName);
  };

  const createAnswer = async ({ roomName, sdp }: { roomName: string; sdp: RTCSessionDescription }) => {
    peerConnectionRef.current?.setRemoteDescription(sdp);
    const answerSdp = await peerConnectionRef.current?.createAnswer();
    peerConnectionRef.current?.setLocalDescription(answerSdp);
    socketEmit('answer', answerSdp, roomName);
  };

  return {
    initSignalingSocket,
  };
}
