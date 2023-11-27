interface useContorollMediaProps {
  localStreamRef: React.MutableRefObject<MediaStream | undefined>;
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
}

export function useControllMedia({ localStreamRef, peerConnectionRef }: useContorollMediaProps) {
  const addTracks = () => {
    if (localStreamRef.current === undefined) {
      return;
    }
    localStreamRef.current.getTracks().forEach(track => {
      peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
    });
  };

  const changeVideoTrack = () => {
    const nowTrack = localStreamRef.current?.getVideoTracks()[0];
    const sender = peerConnectionRef.current?.getSenders().find(sender => sender.track?.kind === 'video');
    sender?.replaceTrack(nowTrack!);
  };

  const changeAudioTrack = () => {
    const nowTrack = localStreamRef.current?.getAudioTracks()[0];
    const sender = peerConnectionRef.current?.getSenders().find(sender => sender.track?.kind === 'audio');
    sender?.replaceTrack(nowTrack!);
  };

  return { addTracks, changeVideoTrack, changeAudioTrack };
}
