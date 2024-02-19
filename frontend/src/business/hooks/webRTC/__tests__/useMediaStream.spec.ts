import { useMediaStream } from '..';
import { act, renderHook } from '@testing-library/react';

import { WebRTC } from '@business/services';

import { useMediaInfo, useMediaStreamStore } from '@stores/zustandStores';

import { __setMockNavigatorWithTracks, createFakeMediaStreamTrack } from '@mocks/webRTC';

vi.mock('@business/services');
vi.mock('.');
describe('useMediaStream 훅', () => {
  const webRTC = WebRTC.getInstance();
  const rerenderHook = () => {
    const {
      result: {
        current: {
          replacePeerconnectionTrack,
          changeMediaTrack,
          disconnectMediaStream,
          localStream,
          remoteStream,
          toggleMediaOnOff,
        },
      },
    } = renderHook(() => useMediaStream());
    return {
      changeMediaTrack,
      disconnectMediaStream,
      localStream,
      remoteStream,
      replacePeerconnectionTrack,
      toggleMediaOnOff,
    };
  };
  beforeAll(() => {
    __setMockNavigatorWithTracks([
      createFakeMediaStreamTrack('audio', 'audio1'),
      createFakeMediaStreamTrack('video', 'video1'),
    ]);
  });
  afterAll(() => {
    vi.clearAllMocks();
  });
  describe('toggleMediaOnOff 함수 테스트', () => {
    [
      {
        scenario: 'mediaInfoChannel이 open이면 반대 상태를 상대에게 전달한다.',
        readyState: 'open',
        type: 'audio',
        enabled: {
          myVideo: false,
          myMic: true,
        },
        expected: JSON.stringify([{ type: 'audio', onOrOff: false }]),
      },
      {
        scenario: 'mediaInfoChannel이 closed면 상태를 상대에게 전달하지 않는다.',
        readyState: 'closed',
        type: 'video',
        enabled: {
          myVideo: true,
          myMic: false,
        },
      },
      {
        scenario: 'mediaEnabled가 true일 때, 해당하는 type의 track을 멈춘다.(video)',
        readyState: 'open',
        type: 'video',
        enabled: {
          myVideo: true,
          myMic: false,
        },
        expected: JSON.stringify([{ type: 'video', onOrOff: false }]),
      },
      {
        scenario: 'mediaEnabled가 false일 때, 해당하는 type의 track을 추가한다.(video)',
        readyState: 'open',
        type: 'video',
        enabled: {
          myVideo: false,
          myMic: false,
        },
        expected: JSON.stringify([{ type: 'video', onOrOff: true }]),
      },
    ].forEach(({ scenario, readyState, type, enabled, expected }) => {
      it(scenario, async () => {
        /**
         * 준비
         */
        const send = vi.fn();
        vi.spyOn(webRTC, 'getDataChannel').mockReturnValueOnce({ readyState, send } as any);

        const getTracks = vi.fn().mockReturnValue([createFakeMediaStreamTrack(type as any, `${type}1`)]);
        const addTrack = vi.fn();
        const removeTrack = vi.fn();
        vi.spyOn(useMediaStreamStore.getState(), 'localStream', 'get').mockReturnValue({
          getTracks,
          addTrack,
          removeTrack,
        } as any);

        vi.spyOn(useMediaInfo.getState(), 'myMicOn', 'get').mockReturnValue(enabled.myMic);
        vi.spyOn(useMediaInfo.getState(), 'myVideoOn', 'get').mockReturnValue(enabled.myVideo);

        /**
         * 실행
         */
        const { toggleMediaOnOff } = rerenderHook();
        await act(async () => {
          await toggleMediaOnOff({ type: type as any });
        });

        /**
         * 검증
         */
        // readyState가 open이면 상대에게 전달한다.
        if (expected) {
          expect(send).toBeCalledWith(expected);
        }
        // readyState가 closed면 상대에게 전달하지 않는다.
        else {
          expect(send).not.toBeCalled();
        }

        // mediaEnabled가 true일 때, 해당하는 type의 track을 멈춘다.
        if (enabled[type === 'video' ? 'myVideo' : 'myMic']) {
          expect(getTracks).toBeCalled();
          expect(removeTrack).toBeCalled();
        }
        // mediaEnabled가 false일 때, 해당하는 type의 track을 추가한다.
        else {
          expect(addTrack).toBeCalled();
        }
      });
    });
  });
  describe('changeMediaTrack 함수 테스트', () => {
    // it('id가 존재할 때, 해당하는 type의 id를 변경한다.', () => {});
    // it('id가 존재할 때, 해당하는 type의 id를 변경하지 않는다.', () => {});
    // it('id와 관계없이 해당하는 type의 track을 멈추고 새로운 track을 추가한다.', () => {});
    [
      {
        scenario: 'id가 존재할 때, 해당하는 type 상태의 id를 변경한다.',
        type: 'audio',
        id: 'audio2',
      },
      {
        scenario: 'id가 존재하지 않을 때, 해당하는 type 상태의 id를 변경하지 않는다.',
        type: 'video',
        id: undefined,
      },
      {
        scenario: 'id와 관계없이 해당하는 type의 track을 멈추고 새로운 track을 추가한다.',
        type: 'video',
        id: 'video2',
      },
    ].forEach(({ scenario, type, id }) => {
      it(scenario, async () => {
        /**
         * 준비
         */
        const getTracks = vi.fn().mockReturnValue([createFakeMediaStreamTrack(type as any, `${type}1`)]);
        const addTrack = vi.fn();
        const removeTrack = vi.fn();
        vi.spyOn(useMediaStreamStore.getState(), 'localStream', 'get').mockReturnValue({
          getTracks,
          addTrack,
          removeTrack,
          getVideoTracks: vi.fn().mockReturnValue([createFakeMediaStreamTrack('video', 'video1')]),
          getAudioTracks: vi.fn().mockReturnValue([createFakeMediaStreamTrack('audio', 'audio1')]),
        } as any);

        const setSelectedCameraID = vi.spyOn(useMediaInfo.getState(), 'setSelectedCameraID');
        const setSelectedAudioID = vi.spyOn(useMediaInfo.getState(), 'setSelectedAudioID');

        /**
         * 실행
         */
        const { changeMediaTrack } = rerenderHook();
        await act(async () => {
          await changeMediaTrack({ type: type as any, id });
        });

        /**
         * 검증
         */
        // id가 존재할 때, 해당하는 type 상태의 id를 변경한다.
        if (id) {
          expect(type === 'audio' ? setSelectedAudioID : setSelectedCameraID).toBeCalledWith(id);
        }
        // id가 존재하지 않을 때, 해당하는 type 상태의 id를 변경하지 않는다.
        else {
          expect(setSelectedCameraID).not.toBeCalled();
          expect(setSelectedAudioID).not.toBeCalled();
        }

        // id와 관계없이 해당하는 type의 track을 멈추고 새로운 track을 추가한다.
        expect(getTracks).toBeCalled();
        expect(removeTrack).toBeCalled();
        expect(addTrack).toBeCalled();
      });
    });
  });

  describe('disconnectMediaStream 함수 테스트', () => {
    it('localStream의 track을 모두 멈추고 제거한다.', () => {
      const stop = vi.fn();
      const removeTrack = vi.fn();
      vi.spyOn(useMediaStreamStore.getState(), 'localStream', 'get').mockReturnValue({
        getTracks: vi.fn().mockReturnValue([{ stop } as any, { stop } as any]),
        removeTrack,
      } as any);

      const { disconnectMediaStream } = rerenderHook();
      disconnectMediaStream();

      expect(stop).toBeCalledTimes(2);
      expect(removeTrack).toBeCalledTimes(2);
    });
  });

  describe('replacePeerconnectionTrack 함수 테스트', () => {
    it('해당하는 type의 track을 변경한다.', () => {
      const getVideoTracks = vi.fn().mockReturnValue([createFakeMediaStreamTrack('video', 'video1')]);
      const getAudioTracks = vi.fn().mockReturnValue([createFakeMediaStreamTrack('audio', 'audio1')]);
      vi.spyOn(useMediaStreamStore.getState(), 'localStream', 'get').mockReturnValue({
        getVideoTracks,
        getAudioTracks,
      } as any);
      const replacePeerconnectionSendersTrack = vi.fn();
      vi.spyOn(webRTC, 'replacePeerconnectionSendersTrack').mockImplementation(replacePeerconnectionSendersTrack);

      const { replacePeerconnectionTrack } = rerenderHook();
      replacePeerconnectionTrack('video');

      expect(getVideoTracks).toBeCalled();
      expect(replacePeerconnectionSendersTrack).toBeCalledWith('video', expect.any(Object));
    });
  });

  describe('localStream, remoteStream 변수 테스트', () => {
    it('localStream, remoteStream 변수를 반환한다.', () => {
      const localStream = {};
      const remoteStream = {};
      vi.spyOn(useMediaStreamStore.getState(), 'localStream', 'get').mockReturnValue(localStream as any);
      vi.spyOn(useMediaStreamStore.getState(), 'remoteStream', 'get').mockReturnValue(remoteStream as any);

      const { localStream: resultLocalStream, remoteStream: resultRemoteStream } = rerenderHook();

      expect(resultLocalStream).toBe(localStream);
      expect(resultRemoteStream).toBe(remoteStream);
    });
  });
});
