import { mockMediaStream } from '@mocks/webRTC';

const initDataChannels = vi.fn();
const dataChannels = vi.fn().mockReturnValue(mockMediaStream);

export const useDataChannel = vi.fn().mockReturnValue({
  initDataChannels,
  dataChannels,
});
