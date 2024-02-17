import { useEffect, useRef } from 'react';

import { WebRTC } from '@business/services';

export function useStreamVideoRef() {
  const webRTC = WebRTC.getInstance();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!remoteVideoRef.current || !webRTC.getRemoteStream()) {
      return;
    }
    remoteVideoRef.current.srcObject = webRTC.getRemoteStream() as MediaStream;
  }, [webRTC.getRemoteStream()?.id]);

  useEffect(() => {
    const existRemoteVideo = remoteVideoRef.current;
    const existRemoteStream = webRTC.getRemoteStream();
    const remoteStreamChanged = (remoteVideoRef.current?.srcObject as MediaStream)?.id !== webRTC.getRemoteStream()?.id;
    if (!existRemoteVideo || !existRemoteStream || !remoteStreamChanged) {
      return;
    }

    remoteVideoRef.current.srcObject = webRTC.getRemoteStream() as MediaStream;
  }, [remoteVideoRef.current]);

  return { localVideoRef, remoteVideoRef };
}
