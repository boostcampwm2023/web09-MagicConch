import { mockMediaStream } from '@mocks/webRTC';

export function useDataChannel() {
  return {
    initDataChannels: vi.fn(),
    dataChannels: vi.fn().mockReturnValue(mockMediaStream),
  };
}
