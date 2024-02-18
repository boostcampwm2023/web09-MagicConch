import { useMedia } from '.';

import { WebRTC } from '@business/services';

import { useMediaInfo, useMediaStreamStore } from '@stores/zustandStores';

export function useMediaStream() {
  const webRTC = WebRTC.getInstance();
  const mediaInfoChannel = webRTC.getDataChannel('mediaInfoChannel');

  const { getAudioStream, getVideoStream } = useMedia();

  const { localStream, remoteStream, setLocalStream } = useMediaStreamStore(state => ({
    localStream: state.localStream,
    remoteStream: state.remoteStream,
    setLocalStream: state.setLocalStream,
  }));

  const { myVideoEnabled, myMicEnabled, toggleMyVideo, toggleMyMic, setSelectedCameraID, setSelectedAudioID } =
    useMediaInfo(state => ({
      myVideoEnabled: state.myVideoOn,
      myMicEnabled: state.myMicOn,
      toggleMyVideo: state.toggleMyVideo,
      toggleMyMic: state.toggleMyMic,
      setSelectedCameraID: state.setSelectedCameraID,
      setSelectedAudioID: state.setSelectedAudioID,
    }));

  const addTracks = (stream: MediaStream) => {
    stream.getTracks().forEach(track => {
      localStream.addTrack(track);
      webRTC.addTrack2PeerConnection(localStream, track);
    });
  };

  const replacePeerconnectionTrack = (type: 'video' | 'audio') => {
    const firstTrack = type === 'video' ? localStream.getVideoTracks()[0] : localStream.getAudioTracks()[0];
    webRTC.replacePeerconnectionSendersTrack(type, firstTrack);
  };

  const stopTracks = (type: 'video' | 'audio') => {
    localStream.getTracks().forEach(track => {
      if (track.kind === type) {
        track.stop();
        localStream.removeTrack(track);
      }
    });
  };

  const toggleMediaOnOff = async (type: 'audio' | 'video') => {
    const mediaEnabled = type === 'video' ? myVideoEnabled : myMicEnabled;
    const toggleMediaState = type === 'video' ? toggleMyVideo : toggleMyMic;

    if (mediaInfoChannel?.readyState === 'open') {
      mediaInfoChannel.send(JSON.stringify([{ type, onOrOff: !mediaEnabled }]));
    }

    toggleMediaState();

    if (mediaEnabled) {
      stopTracks(type);
    } else {
      const stream = type === 'video' ? await getVideoStream() : await getAudioStream();
      addTracks(stream);
      replacePeerconnectionTrack(type);
      setLocalStream(localStream);
    }
  };

  const changeMediaTrack = async (type: 'audio' | 'video', id?: string) => {
    const stream = type === 'audio' ? await getAudioStream({ audioID: id }) : await getVideoStream({ cameraID: id });

    if (id) {
      type === 'audio' ? setSelectedAudioID(id) : setSelectedCameraID(id);
    }

    stopTracks(type);
    addTracks(stream);
    replacePeerconnectionTrack(type);
  };

  const disconnectMediaStream = () => {
    localStream.getTracks().forEach(track => {
      track.stop();
      localStream.removeTrack(track);
    });
  };

  return {
    toggleMediaOnOff,
    changeMediaTrack,
    disconnectMediaStream,
    localStream,
    remoteStream,
  };
}
