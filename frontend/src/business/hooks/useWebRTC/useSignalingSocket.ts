import { usePasswordPopup } from '@business/hooks/usePopup';
import { HumanSocketManager } from '@business/services/SocketManager';

type onSuccessCreateRoom = ({ password, closePopup }: { password: string } & ClosePopupFunc) => void;
type onSuccessJoinRoom = ({ closePopup }: ClosePopupFunc) => void;

export function useSignalingSocket() {
  const { openPasswordPopup } = usePasswordPopup();
  const socketManager = HumanSocketManager.getInstance();

  const createRoom = ({
    roomName,
    onSuccess,
    onCancel,
  }: {
    roomName: string;
    onSuccess?: onSuccessCreateRoom;
    onCancel?: VoidFunction;
  }) => {
    openPasswordPopup({
      host: true,
      onCancel,
      onSubmit: ({ password, closePopup }) =>
        initHostSocketEvents({ password, closePopup: closePopup, roomName, onSuccess }),
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
    onFull?: VoidFunction;
    onFail?: VoidFunction;
    onSuccess?: onSuccessJoinRoom;
    onHostExit?: VoidFunction;
  }) => {
    openPasswordPopup({
      onSubmit: ({ password, closePopup }) =>
        initGuestSocketEvents({ password, roomName, closePopup, onSuccess, onHostExit, onFail, onFull }),
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

export function initHostSocketEvents({
  password,
  roomName,
  closePopup,
  onSuccess,
}: {
  password: string;
  roomName: string;
  closePopup: VoidFunction;
  onSuccess?: onSuccessCreateRoom;
}) {
  const socketManager = HumanSocketManager.getInstance();

  socketManager.emit('createRoom', roomName, password);

  socketManager.on('roomCreated', () => onSuccess?.({ password, closePopup }));
}

export function initGuestSocketEvents({
  password,
  roomName,
  onFail,
  onFull,
  onSuccess,
  onHostExit,
  closePopup,
}: {
  password: string;
  roomName: string;
  onFull?: VoidFunction;
  onFail?: VoidFunction;
  onSuccess?: onSuccessJoinRoom;
  onHostExit?: VoidFunction;
  closePopup: VoidFunction;
}) {
  const socketManager = HumanSocketManager.getInstance();

  socketManager.emit('joinRoom', roomName, password);

  if (onFail) {
    socketManager.on('joinRoomFailed', onFail);
  }
  if (onFull) {
    socketManager.on('roomFull', onFull);
  }
  if (onSuccess) {
    socketManager.on('joinRoomSuccess', () => onSuccess({ closePopup }));
  }
  if (onHostExit) {
    socketManager.on('hostExit', onHostExit);
  }
}
