import { connectSocket, socketEmit, socketOn } from '@business/services/socket';

interface useSignalingSocketArgs {
  roomName: string;
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
}

export function useSignalingSocket({ roomName, peerConnectionRef }: useSignalingSocketArgs) {
  const initSignalingSocket = () => {
    connectSocket();

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

    socketOn('room_full', () => {
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

  const closePeerConnection = () => {
    peerConnectionRef.current?.close();
  };

  return {
    initSignalingSocket,
    closePeerConnection,
  };
}
