// mediaStream 관련 목
export const mockMediaStreamTrack: any = 'track';

export const mockMediaStream = {
  getTracks: vi.fn(),
  getVideoTracks: vi.fn(),
  getAudioTracks: vi.fn(),
} as any as MediaStream;

export const mockRTCTrackEvent = {
  streams: [mockMediaStream],
};
