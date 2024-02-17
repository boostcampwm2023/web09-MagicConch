import { createFakeMediaStreamTrack } from './mediaStreamMock';

export const mockSender = {
  video: {
    track: createFakeMediaStreamTrack('video', 'videoTrack1'),
    replaceTrack: vi.fn(),
  },
  audio: {
    track: createFakeMediaStreamTrack('audio', 'audioTrack1'),
    replaceTrack: vi.fn(),
  },
};

export const mockPeerConnection = {
  addEventListener: vi.fn(),
  createDataChannel: vi.fn(),
  removeEventListener: vi.fn(),
  createOffer: vi.fn(),
  createAnswer: vi.fn(),
  setRemoteDescription: vi.fn(),
  setLocalDescription: vi.fn(),
  addIceCandidate: vi.fn(),
  close: vi.fn(),
  addTrack: vi.fn(),
  getSenders: vi.fn().mockReturnValue([mockSender.video, mockSender.audio]),
} as any;
