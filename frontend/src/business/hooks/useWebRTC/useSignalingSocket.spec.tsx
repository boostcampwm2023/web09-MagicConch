import { useSignalingSocket } from '.';
import { OverlayProvider } from '../useOverlay';
import { act, renderHook, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { HumanSocketManager } from '@business/services/SocketManager';

import { randomString } from '@utils/random';

vi.mock('@business/services/SocketManager');
vi.mock('@utils/random');

describe('useSignalingSocket 훅', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => <OverlayProvider>{children}</OverlayProvider>;

  const rerenderHook = () => {
    const { rerender, result } = renderHook(() => useSignalingSocket(), { wrapper });
    const {
      current: { checkRoomExist, createRoom, joinRoom },
    } = result;
    return {
      checkRoomExist,
      createRoom,
      joinRoom,
      rerender,
    };
  };
  const roomName = '123lk12j3';
  let socket: HumanSocketManager;

  beforeAll(() => {
    socket = HumanSocketManager.getInstance();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('호스트', () => {
    it('방 생성 후 Popup이 열리면 roomCreated 이벤트가 등록된다.', () => {
      const onSuccess = vi.fn();
      const { createRoom } = rerenderHook();

      act(() => {
        createRoom({ roomName, onSuccess });
      });

      expect(socket.on).toBeCalledWith('roomCreated', expect.any(Function));
    });

    it('방 생성 후 Popup에서 확인을 누를시 비밀번호와 함께 socket의 createRoom 이벤트를 emit한다', async () => {
      const randomPassword = randomString();
      const { createRoom } = rerenderHook();

      act(() => {
        createRoom({ roomName });
      });

      const confirmButton = screen.getByRole('button', { name: '확인하기' });
      await userEvent.click(confirmButton);

      expect(socket.emit).toBeCalledWith('createRoom', roomName, randomPassword);
    });
  });

  describe('게스트', () => {
    it('방 입장시 Popup이 열리면 joinRoomFailed, roomFull, joinRoomSuccess, hostExit 이벤트가 등록된다.', () => {
      const onFull = vi.fn();
      const onFail = vi.fn();
      const onSuccess = vi.fn();
      const onHostExit = vi.fn();
      const { joinRoom } = rerenderHook();

      act(() => {
        joinRoom({ roomName, onFull, onFail, onSuccess, onHostExit });
      });

      expect(socket.on).toBeCalledWith('joinRoomFailed', onFail);
      expect(socket.on).toBeCalledWith('roomFull', onFull);
      expect(socket.on).toBeCalledWith('joinRoomSuccess', expect.any(Function));
      expect(socket.on).toBeCalledWith('hostExit', onHostExit);
    });

    it('방 입장시 Popup에서 확인을 누르면 비밀번호와 함께 socket의 joinRoom 이벤트를 emit한다', async () => {
      const userInputPassword = 'userInputPassword';
      const { joinRoom } = rerenderHook();

      act(() => {
        joinRoom({ roomName });
      });

      const input = screen.getByRole('textbox');
      await userEvent.type(input, userInputPassword);

      const confirmButton = screen.getByRole('button', { name: '확인하기' });
      await userEvent.click(confirmButton);

      expect(socket.emit).toBeCalledWith('joinRoom', roomName, userInputPassword);
    });
  });
});
