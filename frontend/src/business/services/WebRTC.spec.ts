import { mockEventType, mockListener, mockOptions, setupEventListener } from '@mocks/event';
import { mockSocketManager } from '@mocks/socket';
import {
  createFakeDataChannel,
  mockMediaStream,
  mockPeerConnection,
  mockRTCDataChannelKeys,
  mockRTCTrackEvent,
  mockRoomName,
  mockSdp,
  mockSender,
} from '@mocks/webRTC';

import WebRTC from './WebRTC';

describe('WebRTC.ts', () => {
  let instance: WebRTC;
  let events: any = {};

  beforeEach(() => {
    global.RTCPeerConnection = vi.fn().mockImplementation(() => mockPeerConnection) as any;
    instance = WebRTC.getInstance(mockSocketManager)!;

    events = {};
    setupEventListener(events, mockPeerConnection);
    instance.resetForTesting();

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

  describe('setLocalStream 메서드', () => {
    it('localStream을 설정해야함', () => {
      instance.setLocalStream(mockMediaStream);
      expect(instance.getLocalStream()).toEqual(mockMediaStream);
    });
  });

  describe('setRemoteStream 메서드', () => {
    it('remoteStream을 설정해야함', () => {
      instance.setRemoteStream(mockMediaStream);
      expect(instance.getRemoteStream()).toEqual(mockMediaStream);
    });
  });

  describe('connectRTCPeerConnection 메서드', () => {
    it('호출시: RTCPeerConnection을 생성', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      expect(instance.getPeerConnection()).toBe(mockPeerConnection);
    });

    it('호출시: track 이벤트 리스너를 추가', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      expect(instance.getPeerConnection()?.addEventListener).toBeCalledWith('track', expect.any(Function), undefined);
    });

    it('호출시: icecandidate 이벤트 리스너를 추가', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      expect(instance.getPeerConnection()?.addEventListener).toBeCalledWith(
        'icecandidate',
        expect.any(Function),
        undefined,
      );
    });

    it('track 이벤트 발생: setRemoteStream 메서드를 호출 해야함', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      events.track(mockRTCTrackEvent);
      expect(instance.getRemoteStream()).toEqual(mockRTCTrackEvent.streams[0]);
    });

    it('icecandidate 이벤트 발생: candidate가 없으면 아무것도 하지 않음', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      events.icecandidate({ candidate: null });
      expect(mockSocketManager.emit).not.toBeCalled();
    });

    it('icecandidate 이벤트 발생: candidate가 있으면 socketManager.emit을 호출해야함', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      events.icecandidate({ candidate: 'candidate' });
      expect(mockSocketManager.emit).toBeCalledWith('candidate', 'candidate', mockRoomName);
    });
  });

  describe('createOffer 메서드', () => {
    it('peerConnection이 없음: 에러를 던짐', async () => {
      expect(instance.createOffer()).rejects.toThrowError();
    });

    it('peerConnection이 있음 createOffer결과를 리턴', async () => {
      instance.connectRTCPeerConnection(mockRoomName);
      mockPeerConnection.createOffer.mockResolvedValue(mockSdp);
      expect(instance.createOffer()).resolves.toBe(mockSdp);
    });
  });

  describe('createAnswer 메서드', () => {
    it('peerConnection이 없음: 에러 발생', async () => {
      expect(instance.createAnswer()).rejects.toThrowError();
    });

    it('peerConnection이 있음: createAnswer결과를 리턴', async () => {
      instance.connectRTCPeerConnection(mockRoomName);
      mockPeerConnection.createAnswer.mockResolvedValue(mockSdp);
      expect(instance.createAnswer()).resolves.toBe(mockSdp);
    });
  });

  describe('setRemoteDescription 메서드', () => {
    it('peerConnection이 없음: 에러 발생', async () => {
      expect(instance.setRemoteDescription()).rejects.toThrowError();
    });

    it('peerConnection이 있음: setRemoteDescription을 호출해야함', async () => {
      instance.connectRTCPeerConnection(mockRoomName);
      instance.setRemoteDescription(mockSdp);
      expect(mockPeerConnection.setRemoteDescription).toBeCalledWith(mockSdp);
    });
  });

  describe('addRTCPeerConnectionEventListener 메서드', () => {
    it('peerConnection 없음: 에러 발생', () => {
      expect(() => instance.addRTCPeerConnectionEventListener(mockEventType, vi.fn())).toThrowError();
    });

    it('peerConnection 있음: peerConnection.addEventListener를 호출해야함', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      instance.addRTCPeerConnectionEventListener(mockEventType, mockListener, mockOptions);
      expect(mockPeerConnection.addEventListener).toBeCalledWith(mockEventType, mockListener, mockOptions);
    });
  });

  describe('addIceCandidate 메서드', () => {
    it('peerConnection 없음: 에러 발생', async () => {
      await expect(instance.addIceCandidate()).rejects.toThrowError();
    });

    it('peerConnection 있음: addIceCandidate를 호출해야함', async () => {
      instance.connectRTCPeerConnection(mockRoomName);
      instance.addIceCandidate(mockSdp);
      expect(mockPeerConnection.addIceCandidate).toBeCalledWith(mockSdp);
    });
  });

  describe('closeRTCPeerConnection 메서드', () => {
    it('호출시 peerConnection.close() 호출, peerConnection = null로 초기화', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      instance.closeRTCPeerConnection();
      expect(mockPeerConnection.close).toBeCalled();
      expect(instance.getPeerConnection()).toBe(null);
    });
  });

  describe('isConnectedPeerConnection 메서드', () => {
    it('peerConnection이 없음 false를 리턴', () => {
      expect(instance.isConnectedPeerConnection()).toBe(false);
    });

    it('peerConnection이 있고, iceConnectionState가 connected: true를 리턴', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      mockPeerConnection.iceConnectionState = 'connected';
      expect(instance.isConnectedPeerConnection()).toBe(true);
    });

    it('peerConnection이 있고, iceConnectionState가 connected 아님: false를 리턴', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      mockPeerConnection.iceConnectionState = '';
      expect(instance.isConnectedPeerConnection()).toBe(false);
    });
  });

  describe('addDataChannel 메서드', () => {
    it('peerConnection이 없음: 에러 발생', () => {
      expect(() => instance.addDataChannel(mockRTCDataChannelKeys[0])).toThrowError();
    });

    it(`peerConnection이 있고, 정상적으로 데이터 채널을 생성:
    \t  1. createDataChannel을 호출해서 데이터 채널을 생성
    \t  2. this.dataChannels에 데이터 채널 추가함
    \t  3. 생성된 데이터 채널을 리턴함`, () => {
      const mockKey = mockRTCDataChannelKeys[0];
      const mockDataChannel = createFakeDataChannel(0);

      instance.connectRTCPeerConnection(mockRoomName);
      mockPeerConnection.createDataChannel.mockReturnValue(mockDataChannel);

      const spy = vi.spyOn(instance, 'addDataChannel');
      instance.addDataChannel(mockRTCDataChannelKeys[0]);

      // 1. peerConnection.createDataChannel로 데이터 채널을 생성함
      expect(mockPeerConnection.createDataChannel).toBeCalledWith(mockRTCDataChannelKeys[0], {
        negotiated: true,
        id: 0,
      });

      // 2. 데이터 채널을 생성후 dataChannels에 추가됨
      const dataChannels = instance.getDataChannel(mockKey);
      expect(dataChannels).toBe(mockDataChannel);

      // 3. 데이터 채널을 생성후 리턴
      expect(spy).toReturnWith(mockDataChannel);
    });
  });

  describe('closeDataChannels 메서드', () => {
    it('호출시: dataChannel.close() 호출: 각 데이터채널의 close() 호출, 데이채널', () => {
      instance.connectRTCPeerConnection(mockRoomName);

      const mockDataChanels: any[] = [];

      // 데이터 채널을 두개 추가함
      [0, 1].forEach(id => {
        mockPeerConnection.createDataChannel.mockReturnValue(createFakeDataChannel(id));
        mockDataChanels.push(instance.addDataChannel(mockRTCDataChannelKeys[id]));
      });

      // 데이터 채널이 두개 추가됨
      expect(instance.getDataChannels().size).toBe(2);

      instance.closeDataChannels();

      // 데이터 채널의 close 메서드가 각각 호출됨
      mockDataChanels.forEach(mockDataChannel => {
        expect(mockDataChannel.close).toBeCalledTimes(1);
      });

      // 데이터 채널이 모두 닫힘
      expect(instance.getDataChannels().size).toBe(0);
    });
  });

  describe('addTracks 메서드', () => {
    it('localStream이 없음: 아무것도 하지 않음', () => {
      instance.addTracks();
      expect(mockPeerConnection.addTrack).not.toBeCalled();
    });

    it('localStream이 있음: localStream.getTracks를 forEach로 돌며 peerConnection.addTrack(track, localStream)실행 ', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      instance.setLocalStream(mockMediaStream);
      instance.addTracks();

      mockMediaStream.getTracks().forEach(track => {
        expect(mockPeerConnection.addTrack).toBeCalledWith(track, mockMediaStream);
      });
    });
  });

  describe('replacePeerconnectionVideoTrack2NowLocalStream 메서드', () => {
    it('localStream이 없음: 아무것도 하지 않음', () => {
      instance.replacePeerconnectionVideoTrack2NowLocalStream();
      expect(mockPeerConnection.addTrack).not.toBeCalled();
    });

    it('localStream이 있음: sender의 replaceTrack(firstVideoTrack)이 호출됨', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      instance.setLocalStream(mockMediaStream);
      instance.replacePeerconnectionVideoTrack2NowLocalStream();

      const firstVideoTrack = mockMediaStream.getVideoTracks()[0];
      expect(mockSender.video.replaceTrack).toBeCalledWith(firstVideoTrack);
    });
  });

  describe('replacePeerconnectionAudioTrack2NowLocalStream 메서드', () => {
    it('localStream이 없음: 아무것도 하지 않음', () => {
      instance.replacePeerconnectionAudioTrack2NowLocalStream();
      expect(mockPeerConnection.addTrack).not.toBeCalled();
    });

    it('localStream이 있음: sender의 replaceTrack(firstVideoTrack)이 호출됨', () => {
      instance.connectRTCPeerConnection(mockRoomName);
      instance.setLocalStream(mockMediaStream);
      instance.replacePeerconnectionAudioTrack2NowLocalStream();

      const firstAudioTrack = mockMediaStream.getAudioTracks()[0];
      expect(mockSender.audio.replaceTrack).toBeCalledWith(firstAudioTrack);
    });
  });
});
