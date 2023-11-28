import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import CamContainer from '@components/CamContainer';

import type { OutletContext } from './HumanChatPage';

export default function ChattingPage() {
  const { localVideoRef, remoteVideoRef, toggleVideo, toggleAudio, cameraConnected, getMedia }: OutletContext =
    useOutletContext();

  useEffect(() => {
    getMedia();
  }, []);

  return (
    <CamContainer
      localVideoRef={localVideoRef}
      remoteVideoRef={remoteVideoRef}
      toggleVideo={toggleVideo}
      toggleAudio={toggleAudio}
      cameraConnected={cameraConnected}
    />
  );
}
