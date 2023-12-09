import { useEffect } from 'react';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';

import WebRTC from './WebRTC';

interface useContorollMediaParams {
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | undefined>;
  localVideoRef: React.RefObject<HTMLVideoElement | undefined>;
  mediaInfoChannel: React.MutableRefObject<RTCDataChannel | undefined>;
  getMedia: ({ cameraID, audioID }: { cameraID?: string; audioID?: string }) => Promise<void>;
}

export function useControllMedia({
  localVideoRef,
  peerConnectionRef,
  mediaInfoChannel,
  getMedia,
}: useContorollMediaParams) {
  const { selectedAudioID, selectedCameraID, setSelectedAudioID, setSelectedCameraID, toggleMyMic, toggleMyVideo } =
    useMediaInfo(state => ({
      toggleMyVideo: state.toggleMyVideo,
      toggleMyMic: state.toggleMyMic,
      setSelectedAudioID: state.setSelectedAudioID,
      setSelectedCameraID: state.setSelectedCameraID,
      selectedAudioID: state.selectedAudioID,
      selectedCameraID: state.selectedCameraID,
    }));

  const webRTC = WebRTC.getInstace();

  const addTracks = () => {
    if (webRTC.localStream === undefined) {
      return;
    }
    webRTC.localStream.getTracks().forEach(track => {
      peerConnectionRef.current?.addTrack(track, webRTC.localStream!);
    });
  };

  const changeVideoTrack = () => {
    const nowTrack = webRTC.localStream?.getVideoTracks()[0];
    const sender = peerConnectionRef.current?.getSenders().find(sender => sender.track?.kind === 'video');
    sender?.replaceTrack(nowTrack!);
  };

  const changeAudioTrack = () => {
    const nowTrack = webRTC.localStream?.getAudioTracks()[0];
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
    if (!mediaInfoChannel.current || mediaInfoChannel.current.readyState !== 'open') return;
    mediaInfoChannel.current.send(JSON.stringify([{ type: 'video', onOrOff: videoTrack.getVideoTracks()[0].enabled }]));
  };

  const toggleAudio = () => {
    if (!localVideoRef.current) {
      return;
    }

    const audioTrack = localVideoRef.current.srcObject as MediaStream;
    audioTrack.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
    toggleMyMic();
    // 여기서 dataChannel로 오디오 on/off를 보내줘야 함
    if (!mediaInfoChannel.current || mediaInfoChannel.current.readyState !== 'open') return;
    mediaInfoChannel.current.send(JSON.stringify([{ type: 'audio', onOrOff: audioTrack.getAudioTracks()[0].enabled }]));
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

  useEffect(() => {
    if (!mediaInfoChannel.current) return;

    mediaInfoChannel.current.addEventListener('open', () => {
      const audioTrack = localVideoRef.current?.srcObject as MediaStream;
      const videoTrack = localVideoRef.current?.srcObject as MediaStream;

      mediaInfoChannel.current?.send(
        JSON.stringify([{ type: 'audio', onOrOff: audioTrack.getAudioTracks()[0].enabled }]),
      );
      mediaInfoChannel.current?.send(
        JSON.stringify([{ type: 'video', onOrOff: videoTrack.getVideoTracks()[0].enabled }]),
      );
    });
  }, [mediaInfoChannel.current]);

  return { addTracks, changeMyVideoTrack, changeMyAudioTrack, toggleVideo, toggleAudio };
}
