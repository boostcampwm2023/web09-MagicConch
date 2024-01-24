import { mockMediaStream } from '@mocks/webRTC';

export function useMedia() {
  return {
    getLocalStream: vi.fn().mockReturnValue(mockMediaStream),
  };
}
