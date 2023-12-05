import { usePasswordPopup } from '../useHumanChat';

import { HumanSocketManager } from '@business/services/SocketManager';

interface useSignalingSocketProps {
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
  negotiationDataChannels: ({ roomName }: { roomName: string }) => void;
}

export function useSignalingSocket({ peerConnectionRef, negotiationDataChannels }: useSignalingSocketProps) {
  const socketManager = new HumanSocketManager();

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
    onClose,
  }: {
    onSuccess?: ({ roomName, password, close }: { roomName: string; password: string; close: () => void }) => void;
    onClose?: ({ close }: { close: () => void }) => void;
  }) => {
    openPasswordPopup({
      host: true,
      onClose: () => {
        onClose?.({ close });
      },
      onSubmit: ({ password, close }) => {
        socketManager.emit('createRoom', password);

        // close();

        socketManager.on('roomCreated', (roomName: string) => {
          onSuccess?.({ roomName, password, close });
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
    onSuccess?: ({ close }: { close: () => void }) => void;
    onHostExit?: () => void;
  }) => {
    openPasswordPopup({
      onSubmit: ({ password, close }) => {
        socketManager.emit('joinRoom', roomName, password);

        socketManager.on('joinRoomFailed', () => {
          onFail?.();
        });

        socketManager.on('roomFull', () => {
          onFull?.();
        });

        socketManager.on('joinRoomSuccess', async () => {
          onSuccess?.({ close });
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
