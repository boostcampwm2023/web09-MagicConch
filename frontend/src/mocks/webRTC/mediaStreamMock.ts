export const createFakeMediaStreamTrack = (kind: 'video' | 'audio', id: string): any => ({
  kind,
  id,
  enabled: true,
  stop: vi.fn(),
});

export const mockMediaStream = {
  getTracks: vi.fn() as any,
  getVideoTracks: vi.fn() as any,
  getAudioTracks: vi.fn() as any,
  id: 'mockMediaStreamId',
} as any as MediaStream;

let originalNavigator: Navigator;
let tracks: MediaStreamTrack[] = [];

export function __setMockNavigatorWithTracks(tracks: MediaStreamTrack[]) {
  originalNavigator = window.navigator;
  __setMockMediaStreamTracks(tracks);

  window.navigator = {
    mediaDevices: {
      enumerateDevices: vi.fn().mockResolvedValue(tracks),
      getUserMedia: vi.fn().mockResolvedValue(mockMediaStream),
    },
  } as any as Navigator;
}

export function __setMockMediaStreamTracks(_tracks: MediaStreamTrack[]) {
  tracks = _tracks;
  vi.spyOn(mockMediaStream, 'getTracks').mockReturnValue(tracks);
  vi.spyOn(mockMediaStream, 'getVideoTracks').mockReturnValue(tracks.filter(track => track.kind === 'video'));
  vi.spyOn(mockMediaStream, 'getAudioTracks').mockReturnValue(tracks.filter(track => track.kind === 'audio'));
}

export const createFakeEnumerateDevice = (kind: 'videoinput' | 'audioinput', id: string): any => ({
  kind,
  deviceId: `fakeDeviceId${id}`,
  groupId: `fakeGroupId${id}`,
  label: `fakeLabel${id}`,
});

afterAll(() => {
  window.navigator = originalNavigator;
  tracks = [];
  vi.clearAllMocks();
});
