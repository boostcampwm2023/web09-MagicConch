import { socketEmit } from '@business/services/socket';

interface useRTCPeerConnectionArgs {
  roomName: string;
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection>;
  localStreamRef: React.MutableRefObject<MediaStream>;
  remoteVideoRef: React.MutableRefObject<HTMLVideoElement>;
}
export function useRTCPeerConnection({
  roomName,
  peerConnectionRef,
  localStreamRef,
  remoteVideoRef,
}: useRTCPeerConnectionArgs) {
  peerConnectionRef.current = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ],
  });

  peerConnectionRef.current.addEventListener('track', e => {
    if (!remoteVideoRef.current) {
      return;
    }

    remoteVideoRef.current.srcObject = e.streams[0];
  });

  peerConnectionRef.current.addEventListener('icecandidate', e => {
    if (!e.candidate) {
      return;
    }

    socketEmit('candidate', e.candidate, roomName);
  });

  if (localStreamRef.current === undefined) {
    return;
  }

  localStreamRef.current.getTracks().forEach(track => {
    peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
  });
}
