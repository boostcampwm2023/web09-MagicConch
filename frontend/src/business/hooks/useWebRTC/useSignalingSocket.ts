import type { InitSocketEvents } from '@components/Popup/PasswordPopup';

import { usePasswordPopup } from '@business/hooks/usePopup';
import { HumanSocketManager } from '@business/services/SocketManager';

export function useSignalingSocket() {
  const { openPasswordPopup } = usePasswordPopup();
  const socketManager = HumanSocketManager.getInstance();

  const createRoom = ({
    roomName,
    onSuccess,
    onCancel,
  }: {
    roomName: string;
    onSuccess?: InitSocketEvents;
    onCancel?: VoidFunction;
  }) => {
    // console.log(socketManager.emit);
    openPasswordPopup({
      host: true,
      onCancel,
      onSubmit: ({ password }) => socketManager.emit('createRoom', roomName, password),
      initSocketEvents: ({ password, closePopup }) => initHostSocketEvents({ password, closePopup, onSuccess }),
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
    onSuccess?: InitSocketEvents;
    onHostExit?: VoidFunction;
  }) => {
    const socketManager = HumanSocketManager.getInstance();

    openPasswordPopup({
      onSubmit: ({ password }) => socketManager.emit('joinRoom', roomName, password),
      initSocketEvents: ({ closePopup }) =>
        initGuestSocketEvents({ closePopup, onSuccess, onHostExit, onFail, onFull }),
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

    onRoomNotExist && socketManager.on('roomNotExist', onRoomNotExist);
    onExistRoom && socketManager.on('roomExist', onExistRoom);
  };

  return {
    createRoom,
    joinRoom,
    checkRoomExist,
  };
}

export function initHostSocketEvents({
  password,
  closePopup,
  onSuccess,
}: {
  password?: string;
  closePopup: VoidFunction;
  onSuccess?: InitSocketEvents;
}) {
  const socketManager = HumanSocketManager.getInstance();

  onSuccess && socketManager.on('roomCreated', () => onSuccess({ password, closePopup }));
}

export function initGuestSocketEvents({
  closePopup,
  onSuccess,
  onHostExit,
  onFail,
  onFull,
}: {
  closePopup: VoidFunction;
  onSuccess?: InitSocketEvents;
  onHostExit?: VoidFunction;
  onFail?: VoidFunction;
  onFull?: VoidFunction;
}) {
  const socketManager = HumanSocketManager.getInstance();

  onFail && socketManager.on('joinRoomFailed', onFail);
  onFull && socketManager.on('roomFull', onFull);
  onSuccess && socketManager.on('joinRoomSuccess', () => onSuccess({ closePopup }));
  onHostExit && socketManager.on('hostExit', onHostExit);
}
