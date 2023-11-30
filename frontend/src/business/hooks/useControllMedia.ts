import { useMediaInfoContext } from './useMediaInfoContext';

interface useContorollMediaProps {
  localStreamRef: React.MutableRefObject<MediaStream | undefined>;
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
  localVideoRef: React.RefObject<HTMLVideoElement | undefined>;
  mediaInfoChannel: React.MutableRefObject<RTCDataChannel | undefined>;
  getMedia: ({ cameraID, audioID }: { cameraID?: string; audioID?: string }) => Promise<void>;
}

export function useControllMedia({
  localVideoRef,
  localStreamRef,
  peerConnectionRef,
  mediaInfoChannel,
  getMedia,
}: useContorollMediaProps) {
  const {
    toggleMyVideo,
    toggleMyMic,
    setSelectedAudioID,
    setSelectedCameraID,
    mediaInfos: { selectedAudioID, selectedCameraID },
  } = useMediaInfoContext();

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

  const toggleVideo = () => {
    if (!localVideoRef.current) {
      return;
    }

    const videoTrack = localVideoRef.current.srcObject as MediaStream;
    videoTrack.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
    toggleMyVideo();
    // 여기서 dataChannel로 비디오 on/off를 보내줘야 함
    mediaInfoChannel.current?.send(
      JSON.stringify([{ type: 'video', onOrOff: videoTrack.getVideoTracks()[0].enabled }]),
    );
  };

  const toggleAudio = () => {
    if (!localVideoRef.current) {
      return;
    }

    const audioTrack = localVideoRef.current.srcObject as MediaStream;
    audioTrack.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
    toggleMyMic();
    // 여기서 dataChannel로 오디오 on/off를 보내줘야 함
    mediaInfoChannel.current?.send(
      JSON.stringify([{ type: 'audio', onOrOff: audioTrack.getAudioTracks()[0].enabled }]),
    );
  };

  const changeMyVideoTrack = async (id?: string) => {
    const cameraID = id || selectedCameraID;

    setSelectedCameraID(cameraID);
    await getMedia({ cameraID });
    changeVideoTrack();
  };

  const changeMyAudioTrack = async (id?: string) => {
    const audioID = id || selectedAudioID;

    setSelectedAudioID(audioID);
    await getMedia({ audioID: audioID });
    changeAudioTrack();
  };

  return { addTracks, changeMyVideoTrack, changeMyAudioTrack, toggleVideo, toggleAudio };
}
