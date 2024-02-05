import { useDataChannel } from '.';
import { renderHook } from '@testing-library/react';

import WebRTC from '@business/services/WebRTC';

describe('useDataChannel 테스트', () => {
  let mockWebRTCModule = WebRTC.getInstance();

  function rerenderHook() {
    const {
      rerender,
      result: {
        current: { dataChannels, initDataChannels },
      },
    } = renderHook(() => useDataChannel());
    return { rerender, dataChannels, initDataChannels };
  }

  const addEventListener = vi.fn();

  beforeAll(() => {
    const mediaInfoChannelStub: any = { addEventListener };
    vi.spyOn(mockWebRTCModule, 'addDataChannel').mockReturnValue(mediaInfoChannelStub);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initDataChannels 함수 테스트: 아래 A ~ D의 함수가 실행됨', () => {
    describe('A. initMediaInfoChannel 함수 테스트', () => {
      it('mediaInfoChannel 데이터 채널 추가 + message와 open 이벤트가 등록됨.', () => {
        const { initDataChannels } = rerenderHook();
        initDataChannels();

        expect(mockWebRTCModule.addDataChannel).toBeCalledWith('mediaInfoChannel');
        expect(addEventListener).toBeCalledWith('message', expect.any(Function));
        expect(addEventListener).toBeCalledWith('open', expect.any(Function));
      });
    });

    describe('B. initChatChannel 함수 테스트', () => {
      it('chatChannel 데이터 채널 추가', () => {
        const { initDataChannels } = rerenderHook();
        initDataChannels();

        expect(mockWebRTCModule.addDataChannel).toBeCalledWith('chatChannel');
      });
    });

    describe('C. initProfileChannel 함수 테스트', () => {
      it('profileChannel 데이터 채널 추가 + message와 open 이벤트가 등록됨.', () => {
        const { initDataChannels } = rerenderHook();
        initDataChannels();

        expect(mockWebRTCModule.addDataChannel).toBeCalledWith('profileChannel');
        expect(addEventListener).toBeCalledWith('message', expect.any(Function));
        expect(addEventListener).toBeCalledWith('open', expect.any(Function));
      });
    });

    describe('D. initNicknameChannel 함수 테스트', () => {
      it('nicknameChannel 데이터 채널 추가 + message와 open 이벤트가 등록됨.', () => {
        const { initDataChannels } = rerenderHook();
        initDataChannels();

        expect(mockWebRTCModule.addDataChannel).toBeCalledWith('nicknameChannel');
        expect(addEventListener).toBeCalledWith('message', expect.any(Function));
        expect(addEventListener).toBeCalledWith('open', expect.any(Function));
      });
    });
  });

  it('dataChannels: webRTC.getDataChannels를 호출 후 그 결과를 반환함', () => {
    const { dataChannels, initDataChannels } = rerenderHook();
    initDataChannels();

    expect(dataChannels).toBe(mockWebRTCModule.getDataChannels());
  });
});
