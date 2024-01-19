export const createFakeMediaStreamTrack = (kind: 'video' | 'audio', id: string): any => ({
  kind,
  id,
  enabled: false,
});

export const mockMediaStream = {
  getTracks: vi
    .fn()
    .mockImplementation(() => [
      createFakeMediaStreamTrack('video', 'videoTrack1'),
      createFakeMediaStreamTrack('video', 'videoTrack2'),
      createFakeMediaStreamTrack('audio', 'audioTrack1'),
      createFakeMediaStreamTrack('audio', 'audioTrack2'),
    ]),
  getVideoTracks: vi
    .fn()
    .mockImplementation(() => [
      createFakeMediaStreamTrack('video', 'videoTrack1'),
      createFakeMediaStreamTrack('video', 'videoTrack2'),
    ]),
  getAudioTracks: vi
    .fn()
    .mockImplementation(() => [
      createFakeMediaStreamTrack('audio', 'audioTrack1'),
      createFakeMediaStreamTrack('audio', 'audioTrack2'),
    ]),
} as any as MediaStream;

export const mockRTCTrackEvent = {
  streams: [
    createFakeMediaStreamTrack('video', 'videoTrack1'),
    createFakeMediaStreamTrack('video', 'videoTrack2'),
    createFakeMediaStreamTrack('audio', 'audioTrack1'),
    createFakeMediaStreamTrack('audio', 'audioTrack2'),
  ],
};
