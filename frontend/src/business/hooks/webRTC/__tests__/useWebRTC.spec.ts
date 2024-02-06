import { resetWebRTCDataChannel, useDataChannel, useMedia, useWebRTC } from '..';
import { renderHook } from '@testing-library/react';

import { WebRTC, initSignalingSocket } from '@business/services';

vi.mock('../useDataChannel');
vi.mock('../useMedia');
vi.mock('@business/services');

const roomName = 'asklje41';

function rerenderHook() {
  const {
    result: {
      current: { startWebRTC, endWebRTC },
    },
  } = renderHook(() => useWebRTC());
  return { startWebRTC, endWebRTC };
}

describe('useWebRTC훅', () => {
  let webRTC: WebRTC;

  beforeAll(() => {
    webRTC = WebRTC.getInstance();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('startWebRTC 메서드', () => {
    it('peerConnection이 연결되어 있으면 false를 반환한다.', () => {
      const testDatas = [true, false];

      testDatas.forEach(async isConnectedPeerConnection => {
        vi.spyOn(webRTC, 'isConnectedPeerConnection').mockReturnValue(isConnectedPeerConnection);

        const { startWebRTC } = rerenderHook();

        if (isConnectedPeerConnection) {
          expect(startWebRTC({ roomName })).resolves.toBe(false);
        } else {
          expect(startWebRTC({ roomName })).not.resolves.any;
        }
      });
    });

    it('peerConnection이 연결되어 있지 않으면 peerConnection을 연결하고, dataChannel을 초기화하고, track을 추가한다.', async () => {
      vi.spyOn(webRTC, 'isConnectedPeerConnection').mockReturnValue(false);
      const spyGetLocalStream = vi.spyOn(useMedia(), 'getLocalStream');
      const { startWebRTC } = rerenderHook();

      await startWebRTC({ roomName });
      const stream = spyGetLocalStream.mock.results[0].value;

      expect(webRTC.setLocalStream).toHaveBeenCalledWith(stream);
      expect(webRTC.connectRTCPeerConnection).toHaveBeenCalledWith(roomName);
      expect(initSignalingSocket).toHaveBeenCalledWith({
        roomName,
        onExitUser: expect.any(Function),
      });
      expect(useDataChannel().initDataChannels).toHaveBeenCalled();
      expect(webRTC.addTracks).toHaveBeenCalled();
    });

    it('유저가 나갔을 때, resetWebRTCDataChannel을 호출하며 데이터채널을 재설정한다.', async () => {
      const initDataChannels = vi.fn();
      resetWebRTCDataChannel(webRTC, initDataChannels, roomName);

      expect(webRTC.closeRTCPeerConnection).toHaveBeenCalled();
      expect(webRTC.closeDataChannels).toHaveBeenCalled();
      expect(webRTC.connectRTCPeerConnection).toHaveBeenCalledWith(roomName);
      expect(initDataChannels).toHaveBeenCalled();
      expect(webRTC.addTracks).toHaveBeenCalled();
    });
  });
});
