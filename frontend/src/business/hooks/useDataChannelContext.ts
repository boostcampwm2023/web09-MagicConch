import { useCallback, useContext } from 'react';

import { DataChannelContext } from './DataChannelProvider';

export function useDataChannelContext() {
  const context = useContext(DataChannelContext);
  if (!context) {
    throw new Error('DataChannelContext must be used within DataChannelProvider');
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
  };
}
