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

  private localStream: MediaStream | undefined;
  private remoteStream: MediaStream | undefined;
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannels: Map<RTCDataChannelKey, RTCDataChannel> = new Map();
  private nextDataChannelId = 0;

  getLocalStream = () => this.localStream;
  getFirstVideoTrack = () => this.localStream?.getVideoTracks()[0];
  getFirstAudioTrack = () => this.localStream?.getAudioTracks()[0];

  getRemoteStream = () => this.remoteStream;
  getPeerConnection = () => this.peerConnection;
  getDataChannels = () => this.dataChannels;
  getDataChannel = (key: RTCDataChannelKey) => this.dataChannels.get(key);
  // getSocketManager = () => this.socketManager;
  // getNextDataChannelId = () => this.nextDataChannelId;

  public resetForTesting() {
    this.localStream = undefined;
    this.remoteStream = undefined;
    this.peerConnection = null;
    this.dataChannels = new Map();
    this.nextDataChannelId = 0;
  }
  public setLocalStream = (stream: MediaStream) => {
    this.localStream = stream;
  };
  public setRemoteStream = (stream: MediaStream) => {
    this.remoteStream = stream;
  };

  public connectRTCPeerConnection = (roomName: string) => {
    const devIceServerConfig = [{ urls: iceServers }];

    this.peerConnection = new RTCPeerConnection({
      // TODO: TURN/STUN서버 추가시 변경해야함.
      iceServers: import.meta.env.MODE === 'development' ? devIceServerConfig : devIceServerConfig,
    });

    this.addRTCPeerConnectionEventListener('track', e => {
      this.setRemoteStream(e.streams[0]);
    });

    this.addRTCPeerConnectionEventListener('icecandidate', e => {
      if (!e.candidate) {
        return;
      }

      this.socketManager.emit('candidate', e.candidate, roomName);
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

  public addRTCPeerConnectionEventListener = <K extends keyof RTCPeerConnectionEventMap>(
    type: K,
    listener: (this: RTCPeerConnection, ev: RTCPeerConnectionEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void => {
    if (!this.peerConnection) {
      throw new Error('addRTCPeerConnectionEventListener 도중 에러, peerConnection이 없습니다.');
    }
    this.peerConnection?.addEventListener(type, listener, options);
  };

  public addIceCandidate = async (candidate?: RTCIceCandidateInit) => {
    if (!candidate) {
      throw new Error('addIceCandidate 도중 에러, candidate가 없습니다.');
    }
    await this.peerConnection?.addIceCandidate(candidate);
  };

  public closeRTCPeerConnection = () => {
    this.peerConnection?.close();
    this.peerConnection = null;
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

  public addTracks = () => {
    if (this.localStream === undefined) {
      return;
    }

    this.localStream.getTracks().forEach(track => {
      this.peerConnection?.addTrack(track, this.localStream!);
    });
  };

  public replacePeerconnectionVideoTrack2NowLocalStream = () => {
    const nowVideoTrack = this.localStream?.getVideoTracks()[0];
    const sender = this.peerConnection?.getSenders().find(sender => sender.track?.kind === 'video');
    sender?.replaceTrack(nowVideoTrack!);
  };

  public replacePeerconnectionAudioTrack2NowLocalStream = () => {
    const nowAudioTrack = this.localStream?.getAudioTracks()[0];
    const sender = this.peerConnection?.getSenders().find(sender => sender.track?.kind === 'audio');
    sender?.replaceTrack(nowAudioTrack!);
  };
}
