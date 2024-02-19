import { useMedia } from '../useMedia';
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import * as Media from '@business/services/Media';

import { useMediaInfo } from '@stores/zustandStores';

import { __setMockMediaStreamTracks, createFakeMediaStreamTrack, mockMediaStream } from '@mocks/webRTC';

const videoSize = { width: 320, height: 320 };

const defaultAudioOptions = true;
const defaultVideoOptions = { facingMode: 'user', ...videoSize };
const createDefaultVideoOptions = (cameraID: string) => ({ deviceId: cameraID, ...videoSize });

const mockCameraId = 'cameraID';
const mockAudioId = 'audioID';
const mockCameraIdState = 'cameraIDState';
const mockAudioIdState = 'audioIDState';

describe('useMedia훅', () => {
  let getUserMediaStream = vi.spyOn(Media, 'getUserMediaStream').mockResolvedValue(mockMediaStream);

  function rerenderHook() {
    const {
      result: {
        current: { getAudioStream, getVideoStream },
      },
    } = renderHook(() => useMedia());
    return { getAudioStream, getVideoStream };
  }

  beforeEach(() => {
    __setMockMediaStreamTracks([
      createFakeMediaStreamTrack('video', mockCameraId),
      createFakeMediaStreamTrack('audio', mockAudioId),
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getAudioStream 테스트', () => {
    it('함수의 인수로 전달된 audioId ✅: 해당 Id로 MediaStream을 받아옴', async () => {
      const { getAudioStream } = rerenderHook();

      await getAudioStream({ audioID: mockAudioId });

      expect(getUserMediaStream).toBeCalledWith({
        audio: { deviceId: mockAudioId },
      });
    });

    it('함수의 인수로 전달된 audioId ❌, 전역의 audioId ✅: 전역의 Id로 MediaStream을 받아옴', async () => {
      act(() => {
        useMediaInfo.getState().setSelectedAudioID(mockAudioIdState);
      });
      const { getAudioStream } = rerenderHook();

      await getAudioStream();

      expect(getUserMediaStream).toBeCalledWith({
        audio: { deviceId: mockAudioIdState },
      });
    });

    it('함수의 인수로 전달된 audioId ❌, 전역의 audioId ❌: 기본 옵션이 들어감', async () => {
      const { getAudioStream } = rerenderHook();

      await getAudioStream();

      expect(getUserMediaStream).toBeCalledWith({
        audio: defaultAudioOptions,
      });
    });
  });

  describe('getVideoStream 테스트', () => {
    it('함수의 인수로 전달된 videoId ✅: 해당 Id로 MediaStream을 받아옴', async () => {
      const { getVideoStream } = rerenderHook();

      await getVideoStream({ cameraID: mockCameraId });

      expect(getUserMediaStream).toBeCalledWith({
        video: createDefaultVideoOptions(mockCameraId),
      });
    });

    it('함수의 인수로 전달된 videoId ❌, 전역의 videoId ✅: 전역의 Id로 MediaStream을 받아옴', async () => {
      act(() => {
        useMediaInfo.getState().setSelectedCameraID(mockCameraIdState);
      });
      const { getVideoStream } = rerenderHook();

      await getVideoStream();

      expect(getUserMediaStream).toBeCalledWith({
        video: createDefaultVideoOptions(mockCameraIdState),
      });
    });

    it('함수의 인수로 전달된 videoId ❌, 전역의 videoId ❌: 기본 옵션이 들어감', async () => {
      const { getVideoStream } = rerenderHook();

      await getVideoStream();

      expect(getUserMediaStream).toBeCalledWith({
        video: defaultVideoOptions,
      });
    });
  });
});
