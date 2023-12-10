import WebRTC from '../../services/WebRTC';
import { useEffect, useRef } from 'react';

import { initSignalingSocket } from '@business/services/Socket';

import { useDataChannel } from './useDataChannel';
import { useMedia } from './useMedia';

export default function useWebRTC() {
  const webRTC = WebRTC.getInstace();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const { getLocalStream } = useMedia();

  const { initDataChannels } = useDataChannel({ localVideoRef });

  const startWebRTC = async ({ roomName }: { roomName: string }) => {
    if (webRTC.isConnectedPeerConnection()) {
      return;
    }

    const stream = await getLocalStream();
    webRTC.setLocalStream(stream);
    localVideoRef.current!.srcObject = stream;

    initSignalingSocket({
      roomName,
      onExitUser: () => {
        webRTC.closeRTCPeerConnection();
        webRTC.closeDataChannels();
        webRTC.connectRTCPeerConnection(roomName);
        initDataChannels();
        webRTC.addTracks();
      },
    });

    webRTC.connectRTCPeerConnection(roomName);
    initDataChannels();
    webRTC.addTracks();
  };

  useEffect(() => {
    return () => {
      webRTC.closeRTCPeerConnection();
      webRTC.closeDataChannels();
    };
  }, []);

  useEffect(() => {
    if (!remoteVideoRef.current || !webRTC.remoteStream) {
      return;
    }
    console.log('chanted track');
    remoteVideoRef.current.srcObject = webRTC.remoteStream as MediaStream;
  }, [webRTC.remoteStream?.id]);

  return {
    localVideoRef,
    remoteVideoRef,
    startWebRTC,
  };
}
