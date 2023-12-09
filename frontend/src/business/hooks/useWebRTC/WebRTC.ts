export default class WebRTC {
  public localStream: MediaStream | undefined;
  public remoteStream: MediaStream | undefined;

  private static instance: WebRTC | undefined;
  constructor() {}

  static getInstace() {
    if (!this.instance) {
      this.instance = new WebRTC();
    }
    return this.instance;
  }

  public setLocalStream(stream: MediaStream) {
    this.localStream = stream;
  }
  public setRemoteStream(stream: MediaStream) {
    this.remoteStream = stream;
  }
}
