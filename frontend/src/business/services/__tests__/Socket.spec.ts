import { WebRTC } from '..';
import { handleWebRTCConnectionSetup, initSignalingSocket, sendCreatedSDP } from '../Socket';
import { HumanSocketManager } from '../SocketManager';

vi.mock('../SocketManager');
vi.mock('..');

describe('Socket 서비스', () => {
  let webRTC: WebRTC;
  let socketManager: HumanSocketManager;

  beforeAll(() => {
    socketManager = HumanSocketManager.getInstance();
    webRTC = WebRTC.getInstance(socketManager);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initSignalingSocket() 함수 테스트.', () => {
    it('socketManager.on() 함수는 welcome, connection, roomFull, userExit와 함께 4번 호출된다', () => {
      const spyOnFn = vi.spyOn(HumanSocketManager.getInstance(), 'on');
      const testEventDatas = ['welcome', 'connection', 'roomFull', 'userExit'];

      initSignalingSocket({ roomName: 'room', onExitUser: vi.fn() });

      expect(spyOnFn).toBeCalledTimes(4);
      testEventDatas.forEach(event => {
        expect(spyOnFn).toBeCalledWith(event, expect.any(Function));
      });
    });

    it('welcom 이벤트가 발생: offer 생성 후 시그널링 서버로 전달한다.', async () => {
      await sendCreatedSDP('roomName', 'offer');

      expect(webRTC.setLocalDescription).toBeCalledWith(await webRTC.createOffer());
      expect(socketManager.emit).toBeCalledWith('connection', {
        roomName: 'roomName',
        description: webRTC.getPeerConnection()?.localDescription,
      });
    });

    describe('connection 이벤트가 발생', () => {
      it('description이 존재할 때, type이 answer일 경우 remoteDescription을 설정한다.', async () => {
        const description = { type: 'offer', sdp: 'sdp' } as any;
        await handleWebRTCConnectionSetup({ roomName: 'roomName', description });

        expect(webRTC.setRemoteDescription).toBeCalledWith(description);
      });

      it('description이 존재할 때, type이 offer일 경우, remoteDescription을 설정한 후, answer를 만들어 시그널링 서버로 보낸다.', async () => {
        const description = { type: 'offer', sdp: 'sdp' } as any;
        await handleWebRTCConnectionSetup({ roomName: 'roomName', description });

        expect(webRTC.setRemoteDescription).toBeCalledWith(description);
        expect(webRTC.setLocalDescription).toBeCalledWith(await webRTC.createAnswer());
        expect(socketManager.emit).toBeCalledWith('connection', {
          roomName: 'roomName',
          description: webRTC.getPeerConnection()?.localDescription,
        });
      });
    });
  });
});
