export const WebRTC = {
  getInstance: vi.fn().mockReturnValue({
    getPeerConnection: vi.fn(),
    getDataChannels: vi.fn(),
    getDataChannel: vi.fn(),
    resetForTesting: vi.fn(),
    connectRTCPeerConnection: vi.fn(),
    createOffer: vi.fn().mockResolvedValue(Promise.resolve('offer')),
    createAnswer: vi.fn().mockResolvedValue(Promise.resolve('answer')),
    setRemoteDescription: vi.fn(),
    setLocalDescription: vi.fn(),
    addIceCandidate: vi.fn(),
    closeRTCPeerConnection: vi.fn(),
    isConnectedPeerConnection: vi.fn(),
    addDataChannel: vi.fn(),
    closeDataChannels: vi.fn(),
    addTrack2PeerConnection: vi.fn(),
    replacePeerconnectionSendersTrack: vi.fn(),
  }),
};
