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
  let getLocalStream: any;

  function rerenderHook() {
    const util = renderHook(() => useMedia());
    getLocalStream = util.result.current.getLocalStream;
  }

  beforeEach(() => {
    rerenderHook();
    __setMockMediaStreamTracks([
      createFakeMediaStreamTrack('video', mockCameraId),
      createFakeMediaStreamTrack('audio', mockAudioId),
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getLocalStream 함수', () => {
    describe('audioId 테스트', () => {
      it('함수의 인수로 전달된 audioId ✅: 해당 Id로 MediaStream을 받아옴', async () => {
        await getLocalStream({ audioID: mockAudioId });

        expect(getUserMediaStream).toBeCalledWith({
          audio: { deviceId: mockAudioId },
          video: defaultVideoOptions,
        });
      });

      it('함수의 인수로 전달된 audioId ❌, 전역의 audioId ✅: 전역의 Id로 MediaStream을 받아옴', async () => {
        act(() => {
          useMediaInfo.getState().setSelectedAudioID(mockAudioIdState);
        });
        rerenderHook();
        await getLocalStream();

        expect(getUserMediaStream).toBeCalledWith({
          audio: { deviceId: mockAudioIdState },
          video: defaultVideoOptions,
        });
      });

      it('함수의 인수로 전달된 audioId ❌, 전역의 audioId ❌: 기본 옵션이 들어감', async () => {
        await getLocalStream({ cameraID: 'mockCameraId' });

        expect(getUserMediaStream).toBeCalledWith({
          audio: defaultAudioOptions,
          video: createDefaultVideoOptions('mockCameraId'),
        });
      });
    });

    describe('cameraId 테스트', () => {
      it('함수의 인수로 전달된 videoId ✅: 해당 Id로 MediaStream을 받아옴', async () => {
        await getLocalStream({ cameraID: mockCameraId });

        expect(getUserMediaStream).toBeCalledWith({
          audio: defaultAudioOptions,
          video: createDefaultVideoOptions(mockCameraId),
        });
      });

      it('함수의 인수로 전달된 videoId ❌, 전역의 videoId ✅: 전역의 Id로 MediaStream을 받아옴', async () => {
        act(() => {
          useMediaInfo.getState().setSelectedCameraID(mockCameraIdState);
        });
        rerenderHook();

        await getLocalStream();

        expect(getUserMediaStream).toBeCalledWith({
          audio: defaultAudioOptions,
          video: createDefaultVideoOptions(mockCameraIdState),
        });
      });

      it('함수의 인수로 전달된 videoId ❌, 전역의 videoId ❌: 기본 옵션이 들어감', async () => {
        await getLocalStream();

        expect(getUserMediaStream).toBeCalledWith({
          audio: defaultAudioOptions,
          video: defaultVideoOptions,
        });
      });
    });

    describe('내 마이크가 꺼져있다면(전역상태 myMicOn이 false라면)', () => {
      it('stream의 audioTrack들의 enabled가 false가 됨', async () => {
        act(() => {
          useMediaInfo.getState().setMyMicOn(false);
        });
        rerenderHook();

        const media = await getLocalStream();

        media.getAudioTracks().forEach((track: any) => {
          expect(track.enabled).toBe(false);
        });
      });
    });

    describe('내 카메라가 꺼져있다면(전역상태 myVideoOn이 false라면)', () => {
      it('stream의 videoTrack들의 enabled가 false가 됨', async () => {
        act(() => {
          useMediaInfo.getState().setMyVideoOn(false);
        });
        rerenderHook();

        const media = await getLocalStream();

        media.getVideoTracks().forEach((track: any) => {
          expect(track.enabled).toBe(false);
        });
      });
    });
  });
});
