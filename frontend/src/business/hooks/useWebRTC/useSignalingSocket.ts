import { usePasswordPopup } from '@business/hooks/usePopup';
import { HumanSocketManager } from '@business/services/SocketManager';

import { ERROR_MESSAGE } from '@constants/ERROR_MESSAGE';

interface useSignalingSocketParams {
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
  negotiationDataChannels: ({ roomName }: { roomName: string }) => void;
}

export function useSignalingSocket({ peerConnectionRef, negotiationDataChannels }: useSignalingSocketParams) {
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
      alert(ERROR_MESSAGE.FULL_ROOM);
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
    roomName,
    onSuccess,
    onClose,
  }: {
    roomName: string;
    onSuccess?: ({ password, close }: { password: string } & CloseFunc) => void;
    onClose?: ({ close }: { close: () => void }) => void;
  }) => {
    openPasswordPopup({
      host: true,
      onClose: () => {
        onClose?.({ close });
      },
      onSubmit: ({ password, close }) => {
        socketManager.emit('createRoom', roomName, password);

        socketManager.on('roomCreated', () => onSuccess?.({ password, close }));
      },
    });
  };

  const joinRoom = ({
    roomName,
    onFull,
    onFail,
    onSuccess,
    onHostExit,
  }: {
    roomName: string;
    onFull?: () => void;
    onFail?: () => void;
    onSuccess?: ({ close }: CloseFunc) => void;
    onHostExit?: () => void;
  }) => {
    openPasswordPopup({
      onSubmit: ({ password, close }) => {
        socketManager.emit('joinRoom', roomName, password);

        socketManager.on('joinRoomFailed', onFail);

        socketManager.on('roomFull', onFull);

        socketManager.on('joinRoomSuccess', () => onSuccess?.({ close }));

        socketManager.on('hostExit', onHostExit);
      },
    });
  };

  const checkRoomExist = ({
    roomName,
    onExistRoom,
    onRoomNotExist,
  }: {
    roomName: string;
    onExistRoom?: () => void;
    onRoomNotExist?: () => void;
  }) => {
    socketManager.emit('checkRoomExist', roomName);

    socketManager.on('roomNotExist', onRoomNotExist);

    socketManager.on('roomExist', onExistRoom);
  };

  return {
    initSignalingSocket,
    createRoom,
    joinRoom,
    checkRoomExist,
  };
}
