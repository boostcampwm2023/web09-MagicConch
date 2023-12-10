import { usePasswordPopup } from '@business/hooks/usePopup';
import { HumanSocketManager } from '@business/services/SocketManager';

export function useSignalingSocket() {
  const socketManager = new HumanSocketManager();
  const { openPasswordPopup } = usePasswordPopup();

  const createRoom = ({
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
      onClose: () => onClose?.({ close }),
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

        if (onFail) {
          socketManager.on('joinRoomFailed', onFail);
        }
        if (onFull) {
          socketManager.on('roomFull', onFull);
        }
        socketManager.on('joinRoomSuccess', () => onSuccess?.({ close }));

        if (onHostExit) {
          socketManager.on('hostExit', onHostExit);
        }
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

    if (onRoomNotExist) {
      socketManager.on('roomNotExist', onRoomNotExist);
    }
    if (onExistRoom) {
      socketManager.on('roomExist', onExistRoom);
    }
  };

  return {
    createRoom,
    joinRoom,
    checkRoomExist,
  };
}
