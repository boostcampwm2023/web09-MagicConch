import { useNavigate } from 'react-router-dom';

import { HumanSocketManager } from '@business/services/SocketManager';

import { usePasswordPopup } from './useHumanChat';

interface useSignalingSocketProps {
  // roomName: string;
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
  negotiationDataChannels: ({ roomName }: { roomName: string }) => void;
}

export function useSignalingSocket({ peerConnectionRef, negotiationDataChannels }: useSignalingSocketProps) {
  const socketManager = new HumanSocketManager();

  const navigate = useNavigate();

  const { openPasswordPopup } = usePasswordPopup();

  const initSignalingSocket = ({ roomName }: { roomName: string }) => {
    socketManager.on('welcome', (users: { id: string }[]) => {
      if (users.length > 0) {
        createOffer({ roomName });
      }
    });

    socketManager.on('offer', (sdp: RTCSessionDescription) => {
      createAnswer({ roomName, sdp });
    });

    socketManager.on('answer', async (sdp: RTCSessionDescription) => {
      await peerConnectionRef.current?.setRemoteDescription(sdp);
    });

    socketManager.on('candidate', async (candidate: RTCIceCandidate) => {
      await peerConnectionRef.current?.addIceCandidate(candidate);
    });

    socketManager.on('roomFull', () => {
      alert('room is full');
    });

    socketManager.on('userExit', async () => {
      negotiationDataChannels({ roomName });
    });
  };

  const createOffer = async ({ roomName }: { roomName: string }) => {
    const sdp = await peerConnectionRef.current?.createOffer();
    await peerConnectionRef.current?.setLocalDescription(sdp);
    socketManager.emit('offer', sdp, roomName);
  };

  const createAnswer = async ({ roomName, sdp }: { roomName: string; sdp: RTCSessionDescription }) => {
    await peerConnectionRef.current?.setRemoteDescription(sdp);
    const answerSdp = await peerConnectionRef.current?.createAnswer();
    peerConnectionRef.current?.setLocalDescription(answerSdp);
    socketManager.emit('answer', answerSdp, roomName);
  };

  const createRoom = async ({
    onSuccess,
  }: {
    onSuccess?: ({ roomName, password }: { roomName: string; password: string }) => void;
  }) => {
    openPasswordPopup({
      host: true,
      onCancel: () => {
        navigate('..');
      },
      onSubmit: ({ password, close }) => {
        socketManager.emit('createRoom', password);

        close();

        socketManager.on('roomCreated', (roomName: string) => {
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
      onCancel: () => {
        navigate('/');
      },
      onSubmit: ({ password, close }) => {
        socketManager.emit('joinRoom', roomName, password);

        socketManager.on('joinRoomFailed', () => {
          onFail?.();
        });

        socketManager.on('roomFull', () => {
          onFull?.();
        });

        socketManager.on('joinRoomSuccess', async () => {
          close();
          onSuccess?.();
        });

        socketManager.on('hostExit', () => {
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
