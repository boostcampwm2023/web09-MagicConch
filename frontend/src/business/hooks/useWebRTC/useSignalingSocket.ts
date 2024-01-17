import { usePasswordPopup } from '@business/hooks/usePopup';
import { HumanSocketManager } from '@business/services/SocketManager';

export function useSignalingSocket() {
  const socketManager = HumanSocketManager.getInstance();
  const { openPasswordPopup } = usePasswordPopup();

  const createRoom = ({
    roomName,
    onSuccess,
    onCancel,
  }: {
    roomName: string;
    onSuccess?: ({ password, closePopup }: { password: string } & ClosePopupFunc) => void;
    onCancel?: () => void;
  }) => {
    openPasswordPopup({
      host: true,
      onCancel,
      onSubmit: ({ password, closePopup }) => {
        socketManager.emit('createRoom', roomName, password);

        socketManager.on('roomCreated', () => onSuccess?.({ password, closePopup }));
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
    onSuccess?: ({ closePopup }: ClosePopupFunc) => void;
    onHostExit?: () => void;
  }) => {
    openPasswordPopup({
      onSubmit: ({ password, closePopup }) => {
        socketManager.emit('joinRoom', roomName, password);

        if (onFail) {
          socketManager.on('joinRoomFailed', onFail);
        }
        if (onFull) {
          socketManager.on('roomFull', onFull);
        }
        socketManager.on('joinRoomSuccess', () => onSuccess?.({ closePopup }));

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
