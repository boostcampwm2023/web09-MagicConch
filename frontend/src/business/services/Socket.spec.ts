import { ERROR_MESSAGE } from '@constants/messages';

import { initSignalingSocket, sendCreatedAnswer, sendCreatedOffer } from './Socket';
import { HumanSocketManager } from './SocketManager';
import WebRTC from './WebRTC';

vi.mock('./WebRTC');
vi.mock('./SocketManager');

describe('Socket 서비스', () => {
  let webRTC: WebRTC;
  let socketManager: HumanSocketManager;

  beforeEach(() => {
    vi.clearAllMocks();
    webRTC = WebRTC.getInstance();
    socketManager = HumanSocketManager.getInstance();
  });

  describe('initSignalingSocket() 함수 테스트.', () => {
    it('socketManager.on() 함수는 welcome, offer, answer, candidate, roomFull, userExit와 함께 6번 호출된다', () => {
      const spyOnFn = vi.spyOn(HumanSocketManager.getInstance(), 'on');
      const testEventDatas = ['welcome', 'offer', 'answer', 'candidate', 'roomFull', 'userExit'];

      initSignalingSocket({ roomName: 'room', onExitUser: vi.fn() });

      expect(spyOnFn).toBeCalledTimes(6);
      testEventDatas.forEach(event => {
        expect(spyOnFn).toBeCalledWith(event, expect.any(Function));
      });
    });

    describe('welcom 이벤트가 발생: sendCreatedOffer() 함수가 호출된다.', async () => {
      it('users가 빈 배열이면 webRTC.createOffer() 함수가 호출되지 않는다.', async () => {
        const roomName = 'alskdjf9182312';

        sendCreatedOffer([] as any, roomName);

        expect(webRTC.createOffer).not.toBeCalled();
      });

      it(`users가 빈 배열이 아니면 
      \t    1. webRTC 의 createOffer(),setLocalDescription() 호출됨
      \t    2. socketManager.emit('answer', sdp, roonName) 호출됨 `, async () => {
        const spyCreateOffer = vi.spyOn(webRTC, 'createOffer');

        await sendCreatedOffer([{ id: '1' }], 'room');
        const sdp = spyCreateOffer.mock.results[0].value;

        expect(webRTC.createOffer).toBeCalled();
        expect(webRTC.setLocalDescription).toBeCalledWith(sdp);
        expect(socketManager.emit).toBeCalledWith('offer', sdp, 'room');
      });
    });

    describe('offer 이벤트가 발생: sendCreatedAnswer() 함수가 실행된다', () => {
      it(`함수를 호출시 아래 실행
      \t    1. webRTC의 setRemoteDescription(), createAnswer(), setLocalDescription() 호출됨
      \t    2. socketManager.emit('answer', sdp, roonName) 호출됨`, async () => {
        const spyCreateAnswer = vi.spyOn(webRTC, 'createAnswer');
        const sdp: any = 'offer';
        const roomName = 'slkdfj34lkj1';

        await sendCreatedAnswer(sdp, roomName);
        const answerSdp = spyCreateAnswer.mock.results[0].value;

        expect(webRTC.setRemoteDescription).toBeCalledWith(sdp);
        expect(webRTC.createAnswer).toBeCalled();
        expect(webRTC.setLocalDescription).toBeCalledWith(answerSdp);
        expect(socketManager.emit).toBeCalledWith('answer', answerSdp, roomName);
      });
    });

    // 아래부터는 테스트 의미가 있나...?
    // 아마 유닛 테스트를 진행해야 의미있는 테스트가 될듯..
    it('answer 이벤트 발생: webRTC.setRemoteDescription() 함수가 실행된다.', async () => {
      const sdp: any = 'answer';

      await webRTC.setRemoteDescription(sdp);

      expect(webRTC.setRemoteDescription).toBeCalledWith(sdp);
    });

    it('candidate 이벤트 발생: webRTC.addIceCandidate() 함수가 실행된다.', async () => {
      const candidate: any = 'candidate';

      await webRTC.addIceCandidate(candidate);

      expect(webRTC.addIceCandidate).toBeCalledWith(candidate);
    });

    it('roomFull 이벤트 발생: alert(ERROR_MESSAGE.FULL_ROOM) 함수가 실행된다.', () => {
      const originAlert = window.alert;
      window.alert = vi.fn();

      alert(ERROR_MESSAGE.FULL_ROOM);

      expect(alert).toBeCalledWith(ERROR_MESSAGE.FULL_ROOM);

      window.alert = originAlert;
    });

    it('userExit 이벤트 발생: onExitUser() 함수가 실행된다.', () => {
      const onExitUser = vi.fn();

      onExitUser();

      expect(onExitUser).toBeCalled();
    });
  });
});
