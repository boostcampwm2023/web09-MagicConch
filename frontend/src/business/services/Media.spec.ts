import { __setMockNavigatorWithTracks, mockMediaStream } from '@mocks/webRTC';

import { getAudioInputOptions, getCameraInputOptions, getMediaDeviceOptions, getUserMediaStream } from './Media';

const createFakeEnumerateDevice = (kind: 'videoinput' | 'audioinput', id: string): any => ({
  kind,
  deviceId: `fakeDeviceId${id}`,
  groupId: `fakeGroupId${id}`,
  label: `fakeLabel${id}`,
});

describe('Media 서비스', () => {
  beforeEach(() => {
    __setMockNavigatorWithTracks([
      createFakeEnumerateDevice('videoinput', 'video1'),
      createFakeEnumerateDevice('videoinput', 'video2'),
      createFakeEnumerateDevice('audioinput', 'audio1'),
      createFakeEnumerateDevice('audioinput', 'audio2'),
    ]);
  });

  describe('getCameraInputOptions 함수', async () => {
    it('카메라 옵션을 반환한다.', async () => {
      const cameraOptions = await getCameraInputOptions();
      expect(cameraOptions).toEqual([
        createFakeEnumerateDevice('videoinput', 'video1'),
        createFakeEnumerateDevice('videoinput', 'video2'),
      ]);
    });
  });

  describe('getAudioInputOptions 함수', async () => {
    it('오디오 옵션을 반환한다.', async () => {
      const audioOptions = await getAudioInputOptions();
      expect(audioOptions).toEqual([
        createFakeEnumerateDevice('audioinput', 'audio1'),
        createFakeEnumerateDevice('audioinput', 'audio2'),
      ]);
    });
  });

  describe('getMediaDeviceOptions 함수', async () => {
    it('카메라 옵션과 오디오 옵션을 반환한다.', async () => {
      const { cameraOptions, audiosOptions } = await getMediaDeviceOptions();

      expect(cameraOptions).toEqual([
        createFakeEnumerateDevice('videoinput', 'video1'),
        createFakeEnumerateDevice('videoinput', 'video2'),
      ]);

      expect(audiosOptions).toEqual([
        createFakeEnumerateDevice('audioinput', 'audio1'),
        createFakeEnumerateDevice('audioinput', 'audio2'),
      ]);
    });
  });

  describe('getUserMediaStream 함수', async () => {
    it('미디어 스트림을 반환한다.', async () => {
      const stream = await getUserMediaStream({ audio: true, video: true });
      expect(stream).toEqual(mockMediaStream);
    });
  });
});
