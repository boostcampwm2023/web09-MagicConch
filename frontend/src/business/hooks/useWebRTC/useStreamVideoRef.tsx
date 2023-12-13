import { useEffect, useRef } from 'react';

import WebRTC from '@business/services/WebRTC';

export function useStreamVideoRef() {
  const webRTC = WebRTC.getInstace();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!remoteVideoRef.current || !webRTC.remoteStream) {
      return;
    }
    remoteVideoRef.current.srcObject = webRTC.remoteStream as MediaStream;
  }, [webRTC.remoteStream?.id]);

  useEffect(() => {
    const existRemoteVideo = remoteVideoRef.current;
    const existRemoteStream = webRTC.remoteStream;
    const remoteStreamChanged = (remoteVideoRef.current?.srcObject as MediaStream)?.id !== webRTC.remoteStream?.id;
    if (!existRemoteVideo || !existRemoteStream || !remoteStreamChanged) {
      return;
    }

    remoteVideoRef.current.srcObject = webRTC.remoteStream as MediaStream;
  }, [remoteVideoRef.current]);

  return { localVideoRef, remoteVideoRef };
}
