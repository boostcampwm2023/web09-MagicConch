// 데이터채널 관련 목
export const mockRTCDataChannelKeys: any[] = ['key1', 'key2', 'key3'];

export const createFakeDataChannel = (id: number) => {
  return {
    close: vi.fn(),
    id,
  };
};
