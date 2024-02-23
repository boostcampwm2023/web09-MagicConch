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
    const eventName = 'eventName' as any;
    const eventListener = vi.fn();

    socketManager.connect();
    socketManager.on(eventName, eventListener);

    expect(spyOn).toBeCalledWith(eventName, eventListener);
  });

  describe('emit(): super.emit()을 호출한다.', () => {
    [
      {
        scenario: 'data: { description: RTCSessionDescription; roomName: string } 형식 인수 emit',
        eventName: 'connection' as any,
        eventArgs: [{ description: 'description', roomName: 'roomName' }],
      },
      {
        scenario: 'data: { candidate: RTCIceCandidate; roomName: string } 형식 인수 emit',
        eventName: 'connection' as any,
        eventArgs: [{ candidate: 'candidate', roomName: 'roomName' }],
      },
      {
        scenario: 'roomName: string 형식 인수 emit',
        eventName: 'checkRoomExist' as any,
        eventArgs: ['roomName'],
      },
      {
        scenario: 'roomId: string, password: string 형식 인수 emit',
        eventName: 'createRoom' as any,
        eventArgs: ['roomId', 'password'],
      },
    ].forEach(({ scenario, eventName, eventArgs }: { scenario: string; eventName: any; eventArgs: any[] }) => {
      it(scenario, () => {
        const socketManager = HumanSocketManager.getInstance();
        const spyOn = vi.spyOn(SocketManager.prototype, 'emit');

        socketManager.connect();

        if (eventArgs.length === 0) {
          socketManager.emit(eventName);
        }
        if (eventArgs.length === 1) {
          socketManager.emit(eventName, eventArgs[0]);
        }
        if (eventArgs.length === 2) {
          socketManager.emit(eventName, eventArgs[0], eventArgs[1]);
        }

        expect(spyOn).toBeCalledWith(eventName, ...eventArgs);
      });
    });
  });
  // it('', () => {
  //   const socketManager = HumanSocketManager.getInstance();
  //   const spyOn = vi.spyOn(SocketManager.prototype, 'emit');
  //   const eventName = 'answer' as any;
  //   const eventArgs = ['id', 'password'] as [string, string];

  //   socketManager.connect();
  //   socketManager.emit(eventName, ...eventArgs);

  //   expect(spyOn).toBeCalledWith(eventName, ...eventArgs);
  // });
});
