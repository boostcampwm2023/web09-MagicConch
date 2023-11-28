import { useSocket } from './useSocket';

interface useSignalingSocketProps {
  roomName: string;
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
}

export function useSignalingSocket({ roomName, peerConnectionRef }: useSignalingSocketProps) {
  const { connectSocket, socketEmit, socketOn } = useSocket('WebRTC');

  const initSignalingSocket = () => {
    connectSocket(import.meta.env.VITE_HUMAN_SOCKET_URL);

    socketOn('welcome', (users: { id: string }[]) => {
      if (users.length > 0) {
        createOffer();
      }
    });

    socketOn('offer', (sdp: RTCSessionDescription) => {
      createAnswer(sdp);
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
  };

  const createOffer = async () => {
    const sdp = await peerConnectionRef.current?.createOffer();
    peerConnectionRef.current?.setLocalDescription(sdp);
    socketEmit('offer', sdp, roomName);
  };

  const createAnswer = async (sdp: RTCSessionDescription) => {
    peerConnectionRef.current?.setRemoteDescription(sdp);
    const answerSdp = await peerConnectionRef.current?.createAnswer();
    peerConnectionRef.current?.setLocalDescription(answerSdp);
    socketEmit('answer', answerSdp, roomName);
  };

  return {
    initSignalingSocket,
  };
}
