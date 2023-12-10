import { iceServers } from '@constants/urls';

import { HumanSocketManager } from './SocketManager';

type RTCDataChannelKey = 'mediaInfoChannel' | 'chatChannel' | 'profileChannel' | 'nicknameChannel';

export default class WebRTC {
  public localStream: MediaStream | undefined;
  public remoteStream: MediaStream | undefined;
  public peerConnection: RTCPeerConnection | null = null;
  public dataChannels: Map<RTCDataChannelKey, RTCDataChannel> = new Map();

  private static instance: WebRTC | undefined;
  private nextDataChannelId = 0;

  socketManager = new HumanSocketManager();

  constructor() {}

  static getInstace() {
    if (!this.instance) {
      this.instance = new WebRTC();
    }
    return this.instance;
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
