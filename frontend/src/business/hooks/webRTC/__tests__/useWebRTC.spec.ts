import { useDataChannel, useWebRTC } from '..';
import { renderHook } from '@testing-library/react';

import { WebRTC, initSignalingSocket } from '@business/services';

vi.mock('../useDataChannel');
vi.mock('../useMedia');
vi.mock('@business/services');

const roomName = 'asklje41';

function rerenderHook() {
  const {
    result: {
      current: { startWebRTC, endWebRTC, resetWebRTCDataChannel },
    },
  } = renderHook(() => useWebRTC());
  return { startWebRTC, endWebRTC, resetWebRTCDataChannel };
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

    it('peerConnection이 연결되어 있지 않으면 peerConnection을 연결하고, dataChannel을 초기화 한다.', async () => {
      vi.spyOn(webRTC, 'isConnectedPeerConnection').mockReturnValue(false);
      const { startWebRTC } = rerenderHook();

      await startWebRTC({ roomName });

      expect(initSignalingSocket).toHaveBeenCalledWith({
        roomName,
        onExitUser: expect.any(Function),
      });
      expect(webRTC.connectRTCPeerConnection).toHaveBeenCalledWith({ roomName, onTrack: expect.any(Function) });
      expect(useDataChannel().initDataChannels).toHaveBeenCalled();
    });

    it('유저가 나갔을 때, resetWebRTCDataChannel을 호출하며 데이터채널을 재설정한다.', async () => {
      const initDataChannels = vi.spyOn(useDataChannel(), 'initDataChannels');
      const { resetWebRTCDataChannel } = rerenderHook();

      resetWebRTCDataChannel(roomName);

      expect(webRTC.closeRTCPeerConnection).toHaveBeenCalled();
      expect(webRTC.closeDataChannels).toHaveBeenCalled();
      expect(webRTC.connectRTCPeerConnection).toHaveBeenCalledWith({ roomName, onTrack: expect.any(Function) });
      expect(initDataChannels).toHaveBeenCalled();
      expect(webRTC.addTrack2PeerConnection).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });
});
