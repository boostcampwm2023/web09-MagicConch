import { useControllMedia, useMedia } from '.';
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import WebRTC from '@business/services/WebRTC';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';

import { __setMockMediaStreamTracks, mockMediaStream } from '@mocks/webRTC';

vi.mock('@business/services/WebRTC');
vi.mock('./useMedia');

type HTMLVideoElementRef = React.RefObject<HTMLVideoElement | undefined>;

function createSpyMediaInfoChannel(mockReturnValue?: Partial<Record<keyof RTCDataChannel, any>>) {
  return vi.spyOn(WebRTC.getInstance(), 'getDataChannel').mockReturnValueOnce(mockReturnValue as any);
}

function filterVideoTrackByEnabled(enabled: boolean) {
  return (mediaStream: MediaStream) => mediaStream.getVideoTracks().filter(track => track.enabled === enabled);
}

function rerenderHook({ localVideoRef }: { localVideoRef: any }) {
  return renderHook(() => useControllMedia({ localVideoRef })).result.current;
}
describe('useControllMedia 훅', () => {
  let webRTC: WebRTC;
  beforeEach(() => {
    vi.clearAllMocks();
    webRTC = WebRTC.getInstance();
    __setMockMediaStreamTracks([
      { kind: 'video', id: 'video1', enabled: true } as any as MediaStreamTrack,
      { kind: 'video', id: 'video2', enabled: false } as any as MediaStreamTrack,
      { kind: 'audio', id: 'audio1', enabled: true } as any as MediaStreamTrack,
      { kind: 'audio', id: 'audio2', enabled: false } as any as MediaStreamTrack,
    ]);
  });

  describe('setLocalVideoSrcObj함수는 ', () => {
    [
      {
        scenario: 'localVideoRef.current가 없을 때 실행되지 않는다.',
        localVideoRef: { current: undefined },
      },
      {
        scenario: 'localVideoRef.current가 있을 때 실행되면 srcObject에 stream을 할당한다.',
        localVideoRef: { current: { srcObject: undefined } },
      },
    ].forEach(({ scenario, localVideoRef }) => {
      it(scenario, () => {
        const stream = 'myTestStream' as any as MediaStream;
        const { setLocalVideoSrcObj } = rerenderHook({ localVideoRef });

        setLocalVideoSrcObj(stream);

        if (!localVideoRef.current) {
          expect(localVideoRef.current).toBeUndefined();
        } else {
          expect(localVideoRef.current?.srcObject).toBe(stream);
        }
      });
    });
  });

  describe('toggleVideo함수는 ', () => {
    [
      {
        scenario: 'localVideoRef.current가 없을 때 실행되지 않는다.',
        localVideoRef: { current: undefined },
      },
      {
        scenario: '채널이 존재하지 않거나 열리있지 않아도 내 비디오 상태는 토글되고, toggleMyVideo()가 호출된다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
      },

      {
        scenario: '있는데 채널이 존재하지 않으면 실행되지 않는다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
      },
      {
        scenario: '있는데 채널이 열려있지 않으면 실행되지 않는다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
        spy: () => ({
          spyMediaInfoChannel: createSpyMediaInfoChannel({ readyState: 'close', send: vi.fn() }),
        }),
      },
      {
        scenario: '있는데 채널이 열려있으면 실행된다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
        spy: () => ({
          spyMediaInfoChannel: createSpyMediaInfoChannel({ readyState: 'open', send: vi.fn() }),
        }),
      },
      {
        scenario: '채널이 존재하고 열려있으면 현재 비디오 트랙 0번째를 mediaInfoChannel채널로 전송한다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
        spy: () => ({
          spyMediaInfoChannel: createSpyMediaInfoChannel({ readyState: 'open', send: vi.fn() }),
        }),
      },
    ].forEach(({ scenario, localVideoRef, spy }) => {
      it(scenario, () => {
        const toggleMyVideo = vi.spyOn(useMediaInfo.getState(), 'toggleMyVideo');
        const beforeVideoEnabled = filterVideoTrackByEnabled(true)(mockMediaStream).length;
        const { spyMediaInfoChannel } = spy?.() ?? {};
        const { toggleVideo } = rerenderHook({ localVideoRef });

        act(() => {
          toggleVideo();
        });
        const afterVideoDisabled = filterVideoTrackByEnabled(false)(mockMediaStream).length;

        if (!localVideoRef.current) {
          expect(localVideoRef.current).toBeUndefined();
          return;
        }

        // 이전에 활성화 됐던 비디오들은 비활성화된다.
        expect(beforeVideoEnabled).toEqual(afterVideoDisabled);
        expect(toggleMyVideo).toBeCalledTimes(1);

        const mediaInfoChannel = spyMediaInfoChannel?.mock.results[0].value;
        if (!mediaInfoChannel || mediaInfoChannel.readyState !== 'open') {
          expect(mediaInfoChannel?.readyState).not.toBe('open');
          return;
        }

        // 첫번째 비디오 트랙의 enabled를 전송
        const videoTracks = mockMediaStream.getVideoTracks();
        expect(mediaInfoChannel.send).toBeCalledWith(
          JSON.stringify([{ type: 'video', onOrOff: videoTracks[0].enabled }]),
        );

        // 두번째 비디오 트랙의 enabled는 전송되지 않음
        expect(mediaInfoChannel.send).not.toBeCalledWith(
          JSON.stringify([{ type: 'video', onOrOff: videoTracks[1].enabled }]),
        );
      });
    });
  });

  describe('toggleAudio함수는 ', () => {
    [
      {
        scenario: 'localVideoRef.current가 없을 때 실행되지 않는다.',
        localVideoRef: { current: undefined },
      },
      {
        scenario: '채널이 존재하지 않거나 열리있지 않아도 내 비디오 상태는 토글되고, toggleMyMic()가 호출된다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
      },

      {
        scenario: '있는데 채널이 존재하지 않으면 실행되지 않는다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
      },
      {
        scenario: '있는데 채널이 열려있지 않으면 실행되지 않는다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
        spy: () => ({
          spyMediaInfoChannel: createSpyMediaInfoChannel({ readyState: 'close' }),
        }),
      },
      {
        scenario: '있는데 채널이 열려있으면 실행된다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
        spy: () => ({
          spyMediaInfoChannel: createSpyMediaInfoChannel({ readyState: 'open', send: vi.fn() }),
        }),
      },
      {
        scenario: '채널이 존재하고 열려있으면 현재 비디오 트랙 0번째를 mediaInfoChannel채널로 전송한다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
        spy: () => ({
          spyMediaInfoChannel: createSpyMediaInfoChannel({ readyState: 'open', send: vi.fn() }),
        }),
      },
    ].forEach(({ scenario, localVideoRef, spy }) => {
      it(scenario, () => {
        const toggleMyMic = vi.spyOn(useMediaInfo.getState(), 'toggleMyMic');
        const beforeAudioEnabled = filterVideoTrackByEnabled(true)(mockMediaStream).length;
        const { spyMediaInfoChannel } = spy?.() ?? {};
        const { toggleAudio } = renderHook(() =>
          useControllMedia({ localVideoRef: localVideoRef as HTMLVideoElementRef }),
        ).result.current;

        act(() => {
          toggleAudio();
        });

        const afterAudioDisabled = filterVideoTrackByEnabled(false)(mockMediaStream).length;

        if (!localVideoRef.current) {
          expect(localVideoRef.current).toBeUndefined();
          return;
        }

        // 이전에 활성화 됐던 오디오들은 비활성화된다.
        expect(beforeAudioEnabled).toEqual(afterAudioDisabled);
        expect(toggleMyMic).toBeCalledTimes(1);

        const mediaInfoChannel = spyMediaInfoChannel?.mock.results[0].value;
        if (!mediaInfoChannel || mediaInfoChannel.readyState !== 'open') {
          expect(mediaInfoChannel?.readyState).not.toBe('open');
          return;
        }

        // 첫번째 오디오 트랙의 enabled를 전송
        const audioTracks = mockMediaStream.getAudioTracks();
        expect(mediaInfoChannel.send).toBeCalledWith(
          JSON.stringify([{ type: 'audio', onOrOff: audioTracks[0].enabled }]),
        );

        // 두번째 오디오 트랙의 enabled는 전송되지 않음
        expect(mediaInfoChannel.send).not.toBeCalledWith(
          JSON.stringify([{ type: 'audio', onOrOff: audioTracks[1].enabled }]),
        );
      });
    });
  });

  describe('changeMyVideoTrack 함수는 로컬스트림을 변경하고, 상대방에게 전달할 현재 내 스트림을 바꾼다', () => {
    [
      {
        scenario: 'id를 입력으로 넣지 않으면 getLocalStream에서 가져온 비디오 트랙으로 위 작업을 수행 ',
        localVideoRef: { current: { srcObject: mockMediaStream } },
      },
      {
        scenario: '만약 id를 입력으로 넣으면 해당 비디오 트랙 id를 상태로 설정한다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
        id: 'testVideoTrackID',
      },
    ].forEach(({ scenario, id, localVideoRef }) => {
      it(scenario, async () => {
        const spySetSelectedCameraID = vi.spyOn(useMediaInfo.getState(), 'setSelectedCameraID');
        const spyGetLocalStream = vi.spyOn(useMedia(), 'getLocalStream');
        const { changeMyVideoTrack } = rerenderHook({ localVideoRef });

        await act(async () => {
          await changeMyVideoTrack(id);
        });

        if (id) {
          expect(spyGetLocalStream).toBeCalledWith({ cameraID: id });
          expect(spySetSelectedCameraID).toBeCalledWith(id);
        } else {
          expect(spyGetLocalStream).toBeCalledWith({});
        }

        // getLocalStream의 결과는 stream
        const stream = spyGetLocalStream.mock.results[0].value;
        // localVideo가 getLocalStream의 결과로 설정된다.
        expect(localVideoRef.current.srcObject).toEqual(stream);
        expect(webRTC.setLocalStream).toBeCalledWith(stream);
        expect(webRTC.replacePeerconnectionVideoTrack2NowLocalStream).toBeCalledTimes(1);
      });
    });
  });

  describe('changeMyAudioTrack 함수는 로컬스트림을 변경하고, 상대방에게 전달할 현재 내 스트림을 바꾼다', () => {
    [
      {
        scenario: 'id를 입력으로 넣지 않으면 getLocalStream에서 가져온 오디오 트랙으로 위 작업을 수행 ',
        localVideoRef: { current: { srcObject: mockMediaStream } },
      },
      {
        scenario: '만약 id를 입력으로 넣으면 해당 오디오 트랙 id를 상태로 설정한다.',
        localVideoRef: { current: { srcObject: mockMediaStream } },
        id: 'testAudioTrackID',
      },
    ].forEach(({ scenario, id, localVideoRef }) => {
      it(scenario, async () => {
        const spySetSelectedAudioID = vi.spyOn(useMediaInfo.getState(), 'setSelectedAudioID');
        const spyGetLocalStream = vi.spyOn(useMedia(), 'getLocalStream');
        const { changeMyAudioTrack } = rerenderHook({ localVideoRef });

        await act(async () => {
          await changeMyAudioTrack(id);
        });

        if (id) {
          expect(spyGetLocalStream).toBeCalledWith({ audioID: id });
          expect(spySetSelectedAudioID).toBeCalledWith(id);
        } else {
          expect(spyGetLocalStream).toBeCalledWith({});
        }

        // getLocalStream의 결과는 stream
        const stream = spyGetLocalStream.mock.results[0].value;
        // localVideo가 getLocalStream의 결과로 설정된다.
        expect(localVideoRef.current.srcObject).toEqual(stream);
        expect(webRTC.setLocalStream).toBeCalledWith(stream);
        expect(webRTC.replacePeerconnectionAudioTrack2NowLocalStream).toBeCalledTimes(1);
      });
    });
  });
});
