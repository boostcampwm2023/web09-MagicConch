import { useNavigate } from 'react-router-dom';

import { usePasswordPopup } from './useHumanChat';
import { useSocket } from './useSocket';

interface useSignalingSocketProps {
  // roomName: string;
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
  negotiationDataChannels: ({ roomName }: { roomName: string }) => void;
}

export function useSignalingSocket({ peerConnectionRef, negotiationDataChannels }: useSignalingSocketProps) {
  const { socketEmit, socketOn } = useSocket('WebRTC');

  const navigate = useNavigate();

  const { openPasswordPopup } = usePasswordPopup();

  const initSignalingSocket = ({ roomName }: { roomName: string }) => {
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
    await peerConnectionRef.current?.setLocalDescription(sdp);
    socketEmit('offer', sdp, roomName);
  };

  const createAnswer = async ({ roomName, sdp }: { roomName: string; sdp: RTCSessionDescription }) => {
    await peerConnectionRef.current?.setRemoteDescription(sdp);
    const answerSdp = await peerConnectionRef.current?.createAnswer();
    peerConnectionRef.current?.setLocalDescription(answerSdp);
    socketEmit('answer', answerSdp, roomName);
  };

  const createRoom = async ({
    onSuccess,
  }: {
    onSuccess?: ({ roomName, password }: { roomName: string; password: string }) => void;
  }) => {
    openPasswordPopup({
      host: true,
      onClose: () => {
        navigate('..');
      },
      onSubmit: ({ password, close }) => {
        socketEmit('createRoom', password);

        close();

        socketOn('roomCreated', (roomName: string) => {
          onSuccess?.({ roomName, password });
        });
      },
    });
  };

  const joinRoom = async ({
    roomName,
    onFull,
    onFail,
    onSuccess,
    onHostExit,
  }: {
    roomName: string;
    onFull?: () => void;
    onFail?: () => void;
    onSuccess?: () => void;
    onHostExit?: () => void;
  }) => {
    openPasswordPopup({
      onClose: () => {
        navigate('/');
      },
      onSubmit: ({ password, close }) => {
        socketEmit('joinRoom', roomName, password);

        socketOn('joinRoomFailed', () => {
          onFail?.();
        });

        socketOn('roomFull', () => {
          onFull?.();
        });

        socketOn('joinRoomSuccess', async () => {
          close();
          onSuccess?.();
        });

        socketOn('hostExit', () => {
          onHostExit?.();
        });
      },
    });
  };

  return {
    initSignalingSocket,
    createRoom,
    joinRoom,
  };
}
