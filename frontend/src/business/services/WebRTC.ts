import { iceServers } from '@constants/urls';

import { HumanSocketManager } from './SocketManager';

type RTCDataChannelKey = 'mediaInfoChannel' | 'chatChannel' | 'profileChannel' | 'nicknameChannel';

export class WebRTC {
  private static instance: WebRTC;
  private socketManager: HumanSocketManager;

  private constructor(socketManager: HumanSocketManager) {
    this.socketManager = socketManager;
  }

  static getInstance(socketManager?: HumanSocketManager) {
    if (!socketManager && !this.instance) {
      throw new Error('socketManager가 초기화 되지 않았습니다.');
    }
    if (socketManager && !this.instance) {
      this.instance = new WebRTC(socketManager);
    }
    return this.instance;
  }

  private peerConnection: RTCPeerConnection | undefined;
  private dataChannels: Map<RTCDataChannelKey, RTCDataChannel> = new Map();
  private nextDataChannelId = 0;

  getPeerConnection = () => this.peerConnection;
  getDataChannels = () => this.dataChannels;
  getDataChannel = (key: RTCDataChannelKey) => this.dataChannels.get(key);

  public resetForTesting() {
    this.peerConnection = undefined;
    this.dataChannels = new Map();
    this.nextDataChannelId = 0;
  }

  public connectRTCPeerConnection = ({
    roomName,
    onTrack,
  }: {
    roomName: string;
    onTrack: (e: RTCTrackEvent) => void;
  }) => {
    const devIceServerConfig = [{ urls: iceServers }];

    this.peerConnection = new RTCPeerConnection({
      // TODO: TURN/STUN서버 추가시 변경해야함.
      iceServers: import.meta.env.MODE === 'development' ? devIceServerConfig : devIceServerConfig,
    });

    this.peerConnection.addEventListener('track', e => {
      onTrack(e);
    });

    // 이 리스너는 재협상이 필요한 상황에서 호출됨
    this.peerConnection.addEventListener('negotiationneeded', async () => {
      // 만약 아직 peerConnection이 초기화되지 않았거나, 연결된적이 없다면 리턴함
      if (this.peerConnection?.signalingState !== 'stable' || !this.peerConnection?.remoteDescription) {
        return;
      }

      const offer = await this.peerConnection?.createOffer();
      await this.setLocalDescription(offer);
      this.socketManager.emit('connection', { roomName, description: this.peerConnection?.localDescription });
    });

    this.peerConnection.addEventListener('icecandidate', e => {
      if (!e.candidate) {
        return;
      }

      this.socketManager.emit('connection', { roomName, candidate: e.candidate });
    });
  };

  public createOffer = async () => {
    const sdp = await this.peerConnection?.createOffer();
    if (!sdp) {
      throw new Error('createOffer 도중 에러, sdp가 없습니다.');
    }
    return sdp;
  };

  public createAnswer = async () => {
    const answer = await this.peerConnection?.createAnswer();
    if (!answer) {
      throw new Error('createAnswer 도중 에러, answer가 없습니다.');
    }
    return answer;
  };

  public setRemoteDescription = async (sdp?: RTCSessionDescriptionInit) => {
    if (!sdp) {
      throw new Error('setRemoteDescription 도중 에러, sdp가 없습니다.');
    }
    await this.peerConnection?.setRemoteDescription(sdp);
  };

  public setLocalDescription = async (sdp?: RTCSessionDescriptionInit) => {
    if (!sdp) {
      throw new Error('setLocalDescription 도중 에러, sdp가 없습니다.');
    }
    await this.peerConnection?.setLocalDescription(sdp);
  };

  public addIceCandidate = async (candidate?: RTCIceCandidateInit) => {
    if (!candidate) {
      throw new Error('addIceCandidate 도중 에러, candidate가 없습니다.');
    }
    await this.peerConnection?.addIceCandidate(candidate);
  };

  public closeRTCPeerConnection = () => {
    this.peerConnection?.close();
    this.peerConnection = undefined;
  };

  public isConnectedPeerConnection = () => {
    if (!this?.peerConnection) {
      return false;
    }
    return this.peerConnection?.iceConnectionState === 'connected';
  };

  public addDataChannel = (key: RTCDataChannelKey) => {
    if (!this.peerConnection) {
      throw new Error('addDataChannel 도중 에러, peerConnection이 없습니다.');
    }

    const dataChannel = this.peerConnection?.createDataChannel(key, {
      negotiated: true,
      id: this.nextDataChannelId++,
    });

    if (dataChannel) {
      this.dataChannels.set(key, dataChannel);
    }

    return dataChannel;
  };

  public closeDataChannels = () => {
    this.dataChannels.forEach(dataChannel => {
      dataChannel.close();
    });
    this.dataChannels.clear();
    this.dataChannels = new Map();
    this.nextDataChannelId = 0;
  };

  public addTrack2PeerConnection = (stream: MediaStream, track: MediaStreamTrack) => {
    this.peerConnection?.addTrack(track, stream);
  };

  public replacePeerconnectionSendersTrack = (type: 'video' | 'audio', track: MediaStreamTrack) => {
    const sender = this.peerConnection?.getSenders().find(sender => sender.track?.kind === type);
    sender?.replaceTrack(track);
  };
}
