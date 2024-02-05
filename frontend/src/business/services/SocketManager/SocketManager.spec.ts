import { SocketManager } from '.';
import { io } from 'socket.io-client';

const url = 'http://localhost:3000';
const path = '/socket';

vi.mock('socket.io-client');

describe('SocketManager 클래스 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('constructor(): 생성할 때 url과 path를 인자로 받는다.', () => {
    const socketManager = new SocketManager(url, path);
    expect(socketManager).toBeInstanceOf(SocketManager);
  });

  it('connect(): 소켓을 정상적으로 연결한다.', () => {
    const socketManager = new SocketManager(url, path);
    socketManager.connect();
    expect(socketManager.connected).toBe(true);
  });

  it('connect(): 이미 연결이 되어있다면 다시 연결하지 않는다.', () => {
    const socketManager = new SocketManager(url, path);
    socketManager.connect();
    socketManager.connect();
    expect(io).toBeCalledTimes(1);
  });

  it('disconnect(): 소켓을 정상적으로 연결 해제한다.', () => {
    const socketManager = new SocketManager(url, path);
    socketManager.connect();
    socketManager.disconnect();
    expect(socketManager.connected).toBe(false);
  });

  it('disconnect(): 이미 연결이 해제되어 있다면 다시 연결 해제하지 않는다.', () => {
    const socketManager = new SocketManager(url, path);
    socketManager.connect();
    const spyDisconnect = vi.spyOn(socketManager.socket!, 'disconnect');

    socketManager.disconnect();
    socketManager.disconnect();
    expect(spyDisconnect).toBeCalledTimes(1);
  });

  it('on(): 소켓이 존재하지 않으면 에러를 발생시킨다.', () => {
    const socketManager = new SocketManager(url, path);
    expect(() => socketManager.on('test', () => {})).toThrow('소켓이 존재하지 않습니다.');
  });

  it('on(): 소켓이 존재하면 정상적으로 이벤트를 등록한다.', () => {
    const socketManager = new SocketManager(url, path);
    socketManager.connect();
    const spyOn = vi.spyOn(socketManager.socket!, 'on');
    const eventName = 'test';
    const eventListener = () => {};

    socketManager.on(eventName, eventListener);
    expect(spyOn).toBeCalledWith(eventName, eventListener);
  });

  it('emit(): 소켓이 존재하지 않으면 에러를 발생시킨다.', () => {
    const socketManager = new SocketManager(url, path);
    expect(() => socketManager.emit('test')).toThrow('소켓이 존재하지 않습니다.');
  });

  it('emit(): 소켓이 존재하면 정상적으로 이벤트를 발생시킨다.', () => {
    const socketManager = new SocketManager(url, path);
    socketManager.connect();
    const spyOn = vi.spyOn(socketManager.socket!, 'emit');
    const eventName = 'test';
    const eventArgs = ['test'];

    socketManager.emit(eventName, ...eventArgs);
    expect(spyOn).toBeCalledWith(eventName, ...eventArgs);
  });
});
