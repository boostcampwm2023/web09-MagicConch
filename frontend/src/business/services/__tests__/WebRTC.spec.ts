import { WebRTC } from '../WebRTC';

import { setupEventListener } from '@mocks/event';
import { mockSocketManager } from '@mocks/socket';
import {
  __setMockMediaStreamTracks,
  createFakeDataChannel,
  createFakeMediaStreamTrack,
  mockPeerConnection,
  mockRTCDataChannelKeys,
  mockRoomName,
  mockSdp,
} from '@mocks/webRTC';

describe('WebRTC.ts', () => {
  let webRTC: WebRTC;
  let events: any = {};
  beforeEach(() => {
    global.RTCPeerConnection = vi.fn().mockImplementation(() => mockPeerConnection) as any;
    webRTC = WebRTC.getInstance(mockSocketManager)!;
    events = {};
    setupEventListener(events, mockPeerConnection);
    webRTC.resetForTesting();
    __setMockMediaStreamTracks([
      createFakeMediaStreamTrack('video', 'video1'),
      createFakeMediaStreamTrack('video', 'video2'),
      createFakeMediaStreamTrack('audio', 'audio1'),
      createFakeMediaStreamTrack('audio', 'audio2'),
    ]);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('해당 모듈이 존재함', () => {
    expect(WebRTC).toBeDefined();
  });

  it('이 모듈은 싱글톤 이어야함', () => {
    const instance1 = WebRTC.getInstance();
    const instance2 = WebRTC.getInstance();
    expect(instance1).toEqual(instance2);
  });

  describe('connectRTCPeerConnection 메서드', () => {
    it('호출시: RTCPeerConnection을 생성', () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      expect(webRTC.getPeerConnection()).toBe(mockPeerConnection);
    });

    it('호출시: track 이벤트 리스너를 추가', () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      expect(webRTC.getPeerConnection()?.addEventListener).toBeCalledWith('track', expect.any(Function));
    });

    it('호출시: icecandidate 이벤트 리스너를 추가', () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      expect(webRTC.getPeerConnection()?.addEventListener).toBeCalledWith('icecandidate', expect.any(Function));
    });

    it('호출시: negotiationneeded 이벤트 리스너를 추가', () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      expect(webRTC.getPeerConnection()?.addEventListener).toBeCalledWith('negotiationneeded', expect.any(Function));
    });

    it('track 이벤트 발생: 인수로 들어온 onTrack이벤트를 발생시킴', () => {
      const onTrack = vi.fn();
      const event = {
        streams: [
          createFakeMediaStreamTrack('video', 'video1'),
          createFakeMediaStreamTrack('video', 'video2'),
          createFakeMediaStreamTrack('audio', 'audio1'),
          createFakeMediaStreamTrack('audio', 'audio2'),
        ],
      };

      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack });
      events.track(event);

      expect(onTrack).toBeCalledWith(event);
    });

    it('icecandidate 이벤트 발생: candidate가 없으면 아무것도 하지 않음', () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      events.icecandidate({ candidate: null });
      expect(mockSocketManager.emit).not.toBeCalled();
    });

    it('icecandidate 이벤트 발생: candidate가 있으면 socketManager.emit을 호출해야함', () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      events.icecandidate({ candidate: 'candidate' });
      expect(mockSocketManager.emit).toBeCalledWith('connection', { roomName: mockRoomName, candidate: 'candidate' });
    });

    it('negotiationneeded 이벤트 발생: 연결된적 없다면 아무것도 하지않음', async () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      events.negotiationneeded();
      expect(mockPeerConnection.createOffer).not.toBeCalled();
    });

    it('negotiationneeded 이벤트 발생: 연결된적이 있으면 createOffer를 호출해야함', async () => {
      mockPeerConnection.signalingState = 'stable';
      mockPeerConnection.remoteDescription = 'remoteDescription';
      mockPeerConnection.createOffer.mockResolvedValue(mockSdp);

      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      events.negotiationneeded();

      expect(mockPeerConnection.createOffer).toBeCalled();
    });
  });

  describe('createOffer 메서드', () => {
    it('peerConnection이 없음: 에러를 던짐', async () => {
      expect(webRTC.createOffer()).rejects.toThrowError();
    });

    it('peerConnection이 있음 createOffer결과를 리턴', async () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      mockPeerConnection.createOffer.mockResolvedValue(mockSdp);
      expect(webRTC.createOffer()).resolves.toBe(mockSdp);
    });
  });
  describe('createAnswer 메서드', () => {
    it('peerConnection이 없음: 에러 발생', async () => {
      expect(webRTC.createAnswer()).rejects.toThrowError();
    });
    it('peerConnection이 있음: createAnswer결과를 리턴', async () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      mockPeerConnection.createAnswer.mockResolvedValue(mockSdp);
      expect(webRTC.createAnswer()).resolves.toBe(mockSdp);
    });
  });
  describe('setRemoteDescription 메서드', () => {
    it('peerConnection이 없음: 에러 발생', async () => {
      expect(webRTC.setRemoteDescription()).rejects.toThrowError();
    });
    it('peerConnection이 있음: setRemoteDescription을 호출해야함', async () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      webRTC.setRemoteDescription(mockSdp);
      expect(mockPeerConnection.setRemoteDescription).toBeCalledWith(mockSdp);
    });
  });

  describe('addIceCandidate 메서드', () => {
    it('peerConnection 없음: 에러 발생', async () => {
      await expect(webRTC.addIceCandidate()).rejects.toThrowError();
    });
    it('peerConnection 있음: addIceCandidate를 호출해야함', async () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      webRTC.addIceCandidate(mockSdp);
      expect(mockPeerConnection.addIceCandidate).toBeCalledWith(mockSdp);
    });
  });
  describe('closeRTCPeerConnection 메서드', () => {
    it('호출시 peerConnection.close() 호출, peerConnection = null로 초기화', () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      webRTC.closeRTCPeerConnection();
      expect(mockPeerConnection.close).toBeCalled();
      expect(webRTC.getPeerConnection()).toBe(undefined);
    });
  });
  describe('isConnectedPeerConnection 메서드', () => {
    it('peerConnection이 없음 false를 리턴', () => {
      expect(webRTC.isConnectedPeerConnection()).toBe(false);
    });
    it('peerConnection이 있고, iceConnectionState가 connected: true를 리턴', () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      mockPeerConnection.iceConnectionState = 'connected';
      expect(webRTC.isConnectedPeerConnection()).toBe(true);
    });
    it('peerConnection이 있고, iceConnectionState가 connected 아님: false를 리턴', () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      mockPeerConnection.iceConnectionState = '';
      expect(webRTC.isConnectedPeerConnection()).toBe(false);
    });
  });
  describe('addDataChannel 메서드', () => {
    it('peerConnection이 없음: 에러 발생', () => {
      expect(() => webRTC.addDataChannel(mockRTCDataChannelKeys[0])).toThrowError();
    });
    it(`peerConnection이 있고, 정상적으로 데이터 채널을 생성:
    \t  1. createDataChannel을 호출해서 데이터 채널을 생성
    \t  2. this.dataChannels에 데이터 채널 추가함
    \t  3. 생성된 데이터 채널을 리턴함`, () => {
      const mockKey = mockRTCDataChannelKeys[0];
      const mockDataChannel = createFakeDataChannel(0);
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      mockPeerConnection.createDataChannel.mockReturnValue(mockDataChannel);
      const spy = vi.spyOn(webRTC, 'addDataChannel');
      webRTC.addDataChannel(mockRTCDataChannelKeys[0]);
      // 1. peerConnection.createDataChannel로 데이터 채널을 생성함
      expect(mockPeerConnection.createDataChannel).toBeCalledWith(mockRTCDataChannelKeys[0], {
        negotiated: true,
        id: 0,
      });
      // 2. 데이터 채널을 생성후 dataChannels에 추가됨
      const dataChannels = webRTC.getDataChannel(mockKey);
      expect(dataChannels).toBe(mockDataChannel);
      // 3. 데이터 채널을 생성후 리턴
      expect(spy).toReturnWith(mockDataChannel);
    });
  });
  describe('closeDataChannels 메서드', () => {
    it('호출시: dataChannel.close() 호출: 각 데이터채널의 close() 호출, 데이채널', () => {
      webRTC.connectRTCPeerConnection({ roomName: mockRoomName, onTrack: vi.fn() });
      const mockDataChanels: any[] = [];
      // 데이터 채널을 두개 추가함
      [0, 1].forEach(id => {
        mockPeerConnection.createDataChannel.mockReturnValue(createFakeDataChannel(id));
        mockDataChanels.push(webRTC.addDataChannel(mockRTCDataChannelKeys[id]));
      });
      // 데이터 채널이 두개 추가됨
      expect(webRTC.getDataChannels().size).toBe(2);
      webRTC.closeDataChannels();
      // 데이터 채널의 close 메서드가 각각 호출됨
      mockDataChanels.forEach(mockDataChannel => {
        expect(mockDataChannel.close).toBeCalledTimes(1);
      });
      // 데이터 채널이 모두 닫힘
      expect(webRTC.getDataChannels().size).toBe(0);
    });
  });
});
