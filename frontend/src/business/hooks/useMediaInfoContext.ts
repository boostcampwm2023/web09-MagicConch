import { MediaInfoContext } from '../../stores/providers/MediaInfoProvider';
import { useCallback, useContext } from 'react';

export function useMediaInfoContext() {
  const context = useContext(MediaInfoContext);
  if (!context) {
    throw new Error('MediaInfoContext must be used within DataChannelProvider');
  }
  const { mediaInfos, setMediaInfos } = context;
  const toggleMyVideo = useCallback(() => {
    setMediaInfos(prev => ({ ...prev, myVideoOn: !prev.myVideoOn }));
  }, []);

  const toggleMyMic = useCallback(() => {
    setMediaInfos(prev => ({ ...prev, myMicOn: !prev.myMicOn }));
  }, []);

  const toggleRemoteVideo = useCallback(() => {
    setMediaInfos(prev => ({ ...prev, remoteVideoOn: !prev.remoteVideoOn }));
  }, []);

  const toggleRemoteMic = useCallback(() => {
    setMediaInfos(prev => ({ ...prev, remoteMicOn: !prev.remoteMicOn }));
  }, []);

  const setMyVideoOn = useCallback((value: boolean) => {
    setMediaInfos(prev => ({ ...prev, myVideoOn: value }));
  }, []);

  const setMyMicOn = useCallback((value: boolean) => {
    setMediaInfos(prev => ({ ...prev, myMicOn: value }));
  }, []);

  const setRemoteVideoOn = useCallback((value: boolean) => {
    setMediaInfos(prev => ({ ...prev, remoteVideoOn: value }));
  }, []);

  const setRemoteMicOn = useCallback((value: boolean) => {
    setMediaInfos(prev => ({ ...prev, remoteMicOn: value }));
  }, []);

  const setSelectedCameraID = useCallback((value: string) => {
    setMediaInfos(prev => ({ ...prev, selectedCameraID: value }));
  }, []);

  const setSelectedAudioID = useCallback((value: string) => {
    setMediaInfos(prev => ({ ...prev, selectedAudioID: value }));
  }, []);

  return {
    mediaInfos,
    setMediaInfos,
    toggleMyVideo,
    toggleMyMic,
    toggleRemoteVideo,
    toggleRemoteMic,
    setMyVideoOn,
    setMyMicOn,
    setRemoteVideoOn,
    setRemoteMicOn,
    setSelectedCameraID,
    setSelectedAudioID,
  };
}
