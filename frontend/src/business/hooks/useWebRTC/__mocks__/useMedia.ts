import { mockMediaStream } from '@mocks/webRTC';

const getLocalStream = vi.fn().mockReturnValue(Promise.resolve(mockMediaStream));

export const useMedia = vi.fn().mockReturnValue({
  getLocalStream,
});
