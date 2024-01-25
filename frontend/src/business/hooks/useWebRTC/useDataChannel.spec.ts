import { useDataChannel } from '.';
import { RenderHookResult, renderHook } from '@testing-library/react';

import WebRTC from '@business/services/WebRTC';

import {
  sendMyNickname,
  sendMyProfileImage,
  sendNowMediaStates,
  setMediaStates,
  setRemoteNicknameState,
  setRemoteProfileImageState,
} from './useDataChannel.eventListeners';

vi.mock('@business/services/WebRTC');

type RenderHookResultType = {
  initDataChannels: () => void;
  dataChannels: Map<any, RTCDataChannel>;
};

describe('useDataChannel 테스트', () => {
  let mockWebRTCModule = WebRTC.getInstance();
  let renderUtil: RenderHookResult<RenderHookResultType, unknown>;
  let currentRenderResult: RenderHookResultType;

  function rerenderHook() {
    renderUtil = renderHook(() => useDataChannel());
    currentRenderResult = renderUtil.result.current;
  }

  const addEventListener = vi.fn();

  beforeAll(() => {
    const mediaInfoChannelStub: any = { addEventListener };
    vi.spyOn(mockWebRTCModule, 'addDataChannel').mockReturnValue(mediaInfoChannelStub);
  });

  beforeEach(() => {
    rerenderHook();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  describe('initDataChannels 함수 테스트: 아래 A ~ B의 함수가 실행됨', () => {
    describe('A. initMediaInfoChannel 함수 테스트', () => {
      it('mediaInfoChannel 데이터 채널 추가 + message와 open 이벤트가 등록됨.', () => {
        currentRenderResult.initDataChannels();

        expect(mockWebRTCModule.addDataChannel).toBeCalledWith('mediaInfoChannel');
        expect(addEventListener).toBeCalledWith('message', expect.any(Function));
        expect(addEventListener).toBeCalledWith('open', expect.any(Function));
      });

      it(`message 이벤트: setMediaStates 호출
      \t    1. type === video라면 onOrOff와 함께 setRemoteVideoOn 호출, 상대 비디오 상태 설정
      \t    2. type === audio라면 onOrOff와 함께 setMicOn 호출, 상대 마이크 상태 설정`, () => {
        const testDatas = [
          { data: JSON.stringify([{ type: 'video', onOrOff: true }]) },
          { data: JSON.stringify([{ type: 'audio', onOrOff: true }]) },
          { data: JSON.stringify([{ type: 'video', onOrOff: false }]) },
          { data: JSON.stringify([{ type: 'audio', onOrOff: false }]) },
        ];

        testDatas.forEach(async (ev: any) => {
          const setRemoteMicOn = vi.fn();
          const setRemoteVideoOn = vi.fn();
          const { type, onOrOff } = JSON.parse(ev.data);

          setMediaStates({ ev, setRemoteMicOn, setRemoteVideoOn });

          if (type === 'audio') {
            expect(setRemoteMicOn).toBeCalledWith(onOrOff);
            expect(setRemoteVideoOn).not.toBeCalled();
          }

          if (type === 'video') {
            expect(setRemoteMicOn).not.toBeCalled();
            expect(setRemoteVideoOn).toBeCalledWith(onOrOff);
          }
        });
      });

      it('open 이벤트: sendNowMediaStates 호출, 현재 미디어 상태를 전송', () => {
        const testDatas = [
          { audioTrack: { enabled: true }, videoTrack: { enabled: true } },
          { audioTrack: { enabled: false }, videoTrack: { enabled: false } },
          { audioTrack: { enabled: true }, videoTrack: { enabled: false } },
          { audioTrack: { enabled: false }, videoTrack: { enabled: true } },
        ];

        testDatas.forEach(({ audioTrack, videoTrack }) => {
          vi.spyOn(mockWebRTCModule, 'getFirstAudioTrack').mockReturnValueOnce(audioTrack as any);
          vi.spyOn(mockWebRTCModule, 'getFirstVideoTrack').mockReturnValueOnce(videoTrack as any);
          const RTCDataChannelSendFn = vi.fn();

          sendNowMediaStates.call({ send: RTCDataChannelSendFn } as any);

          expect(RTCDataChannelSendFn).toBeCalledWith(
            JSON.stringify([
              { type: 'audio', onOrOff: audioTrack?.enabled },
              { type: 'video', onOrOff: videoTrack?.enabled },
            ]),
          );
        });
      });
    });

    describe('B. initChatChannel 함수 테스트', () => {
      it('chatChannel 데이터 채널 추가', () => {
        currentRenderResult.initDataChannels();

        expect(mockWebRTCModule.addDataChannel).toBeCalledWith('chatChannel');
      });
    });

    describe('C. initProfileChannel 함수 테스트', () => {
      it('profileChannel 데이터 채널 추가 + message와 open 이벤트가 등록됨.', () => {
        currentRenderResult.initDataChannels();

        expect(mockWebRTCModule.addDataChannel).toBeCalledWith('profileChannel');
        expect(addEventListener).toBeCalledWith('message', expect.any(Function));
        expect(addEventListener).toBeCalledWith('open', expect.any(Function));
      });

      it(`message 이벤트: setRemoteProfileImageState(ev) 호출, 상대의 프로필사진을 설정함`, () => {
        const setRemoteProfileImage = vi.fn();
        const arrayBuffer = new ArrayBuffer(8);
        const type = 'image/png';
        const ev = { data: JSON.stringify({ type, arrayBuffer: new Uint8Array(arrayBuffer) }) } as any as MessageEvent;

        setRemoteProfileImageState({ ev, setRemoteProfileImage } as any);

        expect(setRemoteProfileImage).toBeCalledWith({ arrayBuffer, type });
      });

      it(`on 이벤트: sendMyProfileImage(myProfile) 호출, 내 프로필 사진을 전송함`, () => {
        const myProfile = { arrayBuffer: new ArrayBuffer(8), type: 'image/png' };
        const RTCDataChannelSendFn = vi.fn();

        sendMyProfileImage.call({ send: RTCDataChannelSendFn } as any, { myProfile });

        expect(RTCDataChannelSendFn).toBeCalledWith(JSON.stringify({ myProfile }));
      });
    });

    describe('D. initNicknameChannel 함수 테스트', () => {
      it('nicknameChannel 데이터 채널 추가 + message와 open 이벤트가 등록됨.', () => {
        currentRenderResult.initDataChannels();

        expect(mockWebRTCModule.addDataChannel).toBeCalledWith('nicknameChannel');
        expect(addEventListener).toBeCalledWith('message', expect.any(Function));
        expect(addEventListener).toBeCalledWith('open', expect.any(Function));
      });

      it(`message 이벤트: setRemoteNicknameState(ev) 호출, 상대의 닉네임을 설정함`, () => {
        const setRemoteNickname = vi.fn();
        const ev = { data: 'testNickName' } as any as MessageEvent;

        setRemoteNicknameState({ ev, setRemoteNickname } as any);

        expect(setRemoteNickname).toBeCalledWith('testNickName');
      });

      it(`on 이벤트: sendMyNickname(myNickname) 호출, 내 닉네임을 전송함`, () => {
        const myNickname = 'testNickName';
        const RTCDataChannelSendFn = vi.fn();

        sendMyNickname.call({ send: RTCDataChannelSendFn } as any, { myNickname });

        expect(RTCDataChannelSendFn).toBeCalledWith(myNickname);
      });
    });
  });

  it('dataChannels: webRTC.getDataChannels를 호출 후 그 결과를 반환함', () => {
    expect(currentRenderResult.dataChannels).toBe(mockWebRTCModule.getDataChannels());
  });
});
