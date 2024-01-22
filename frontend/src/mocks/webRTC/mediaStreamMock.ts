export const createFakeMediaStreamTrack = (kind: 'video' | 'audio', id: string): any => ({
  kind,
  id,
  enabled: true,
});

export const mockMediaStream = {
  getTracks: vi
    .fn()
    .mockImplementation(() => [
      createFakeMediaStreamTrack('video', 'video1'),
      createFakeMediaStreamTrack('video', 'video2'),
      createFakeMediaStreamTrack('audio', 'audio1'),
      createFakeMediaStreamTrack('audio', 'audio2'),
    ]),
  getVideoTracks: vi
    .fn()
    .mockImplementation(() => [
      createFakeMediaStreamTrack('video', 'video1'),
      createFakeMediaStreamTrack('video', 'video2'),
    ]),
  getAudioTracks: vi
    .fn()
    .mockImplementation(() => [
      createFakeMediaStreamTrack('audio', 'audio1'),
      createFakeMediaStreamTrack('audio', 'audio2'),
    ]),
} as any as MediaStream;

export const mockRTCTrackEvent = {
  streams: [
    createFakeMediaStreamTrack('video', 'video1'),
    createFakeMediaStreamTrack('video', 'video2'),
    createFakeMediaStreamTrack('audio', 'audio1'),
    createFakeMediaStreamTrack('audio', 'audio2'),
  ],
};
