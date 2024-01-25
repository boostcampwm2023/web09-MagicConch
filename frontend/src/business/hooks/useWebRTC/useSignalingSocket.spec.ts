import { initGuestSocketEvents, initHostSocketEvents, useSignalingSocket } from '.';
import { usePasswordPopup } from '../usePopup';
import { renderHook } from '@testing-library/react';

import { HumanSocketManager } from '@business/services/SocketManager';

vi.mock('@business/hooks/usePopup/usePasswordPopup');
vi.mock('@business/services/SocketManager/HumanSocketManager');

describe('useSignalingSocket 훅', () => {
  const rerenderHook = () => renderHook(() => useSignalingSocket()).result.current;
  const roomName = '123lk12j3';
  const password = '1234';
  let socket: HumanSocketManager;

  beforeAll(() => {
    socket = HumanSocketManager.getInstance();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('createRoom(), 호스트가 방 생성시 호출되는 함수 host:true로 호출됨', () => {
    const onSuccess = vi.fn();
    const onCancel = vi.fn();
    const { createRoom } = rerenderHook();

    createRoom({ roomName, onSuccess, onCancel });

    expect(usePasswordPopup().openPasswordPopup).toBeCalledWith({
      host: true,
      onCancel,
      onSubmit: expect.any(Function),
    });
  });

  it('createRoom함수는 passwordPopup에서 제출이 되면 initHostSocketEvents함수를 호출하며 이벤트를 등록한다.', () => {
    const onSuccess = vi.fn();

    initHostSocketEvents({ password, closePopup: vi.fn(), roomName, onSuccess });

    expect(socket.emit).toBeCalledWith('createRoom', roomName, password);
    expect(socket.on).toBeCalledWith('roomCreated', expect.any(Function));
  });

  it('joinRoom(), 게스트가 방 입장시 호출되는 함수 host:false로 호출됨', () => {
    const onFull = vi.fn();
    const onFail = vi.fn();
    const onSuccess = vi.fn();
    const onHostExit = vi.fn();
    const { joinRoom } = rerenderHook();

    joinRoom({ roomName, onFull, onFail, onSuccess, onHostExit });

    expect(usePasswordPopup().openPasswordPopup).toBeCalledWith({
      onSubmit: expect.any(Function),
    });
  });

  it('joinRoom함수는 passwordPopup에서 제출이 되면 initGuestSocketEvents함수를 호출하며 이벤트를 등록한다.', () => {
    const testDatas = [{ onSuccess: vi.fn() }, { onHostExit: vi.fn() }, { onFail: vi.fn() }, { onFull: vi.fn() }];

    testDatas.forEach(({ onFail, onFull, onHostExit, onSuccess }) => {
      initGuestSocketEvents({ password, roomName, closePopup: vi.fn(), onSuccess, onHostExit, onFail, onFull });

      expect(socket.emit).toBeCalledWith('joinRoom', roomName, password);

      if (onFail) {
        expect(socket.on).toBeCalledWith('joinRoomFailed', onFail);
      } else {
        expect(socket.on).not.toBeCalledWith('joinRoomFailed', expect.any(Function));
      }

      if (onFull) {
        expect(socket.on).toBeCalledWith('roomFull', onFull);
      } else {
        expect(socket.on).not.toBeCalledWith('roomFull', expect.any(Function));
      }

      if (onSuccess) {
        expect(socket.on).toBeCalledWith('joinRoomSuccess', expect.any(Function));
      } else {
        expect(socket.on).not.toBeCalledWith('joinRoomSuccess', expect.any(Function));
      }

      if (onHostExit) {
        expect(socket.on).toBeCalledWith('hostExit', onHostExit);
      } else {
        expect(socket.on).not.toBeCalledWith('hostExit', expect.any(Function));
      }

      vi.clearAllMocks();
    });
  });

  it('checkRoomExist(), 방이 존재하는지 확인하는 함수: 함수가 존재하면 이벤트를 등록한다.', () => {
    const testDatas = [{ onExistRoom: vi.fn() }, { onRoomNotExist: vi.fn() }];
    testDatas.forEach(({ onExistRoom, onRoomNotExist }) => {
      const { checkRoomExist } = rerenderHook();

      checkRoomExist({ roomName, onExistRoom, onRoomNotExist });

      expect(socket.emit).toBeCalledWith('checkRoomExist', roomName);

      if (onExistRoom) {
        expect(socket.on).toBeCalledWith('roomExist', onExistRoom);
      } else {
        expect(socket.on).not.toBeCalledWith('roomExist', onExistRoom);
      }

      if (onRoomNotExist) {
        expect(socket.on).toBeCalledWith('roomNotExist', onRoomNotExist);
      } else {
        expect(socket.on).not.toBeCalledWith('roomNotExist', onRoomNotExist);
      }
    });
  });
});
