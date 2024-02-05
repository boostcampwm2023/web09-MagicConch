import { HumanSocketManager, SocketManager } from '..';

vi.mock('socket.io-client');

describe('HumanSocketManager 클래스 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('이 클래스는 SocketManager를 상속받는다.', () => {
    const socketManager = HumanSocketManager.getInstance();
    expect(socketManager).toBeInstanceOf(SocketManager);
  });

  it('이 클래스는 싱글톤 패턴으로 구현되어 있다.', () => {
    const socketManager1 = HumanSocketManager.getInstance();
    const socketManager2 = HumanSocketManager.getInstance();
    expect(socketManager1).toBe(socketManager2);
  });

  it('on(): super.on()을 호출한다.', () => {
    const socketManager = HumanSocketManager.getInstance();
    const spyOn = vi.spyOn(SocketManager.prototype, 'on');
    const eventName = 'answer';
    const eventListener = vi.fn();

    socketManager.connect();
    socketManager.on(eventName, eventListener);

    expect(spyOn).toBeCalledWith(eventName, eventListener);
  });

  it('emit(): super.emit()을 호출한다.', () => {
    const socketManager = HumanSocketManager.getInstance();
    const spyOn = vi.spyOn(SocketManager.prototype, 'emit');
    const eventName = 'answer';
    const eventArgs = ['test'];

    socketManager.connect();
    socketManager.emit(eventName, ...eventArgs);

    expect(spyOn).toBeCalledWith(eventName, ...eventArgs);
  });
});
