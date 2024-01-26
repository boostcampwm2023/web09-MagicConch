import { useStreamVideoRef } from '.';
import { act, renderHook } from '@testing-library/react';
import React from 'react';

import WebRTC from '@business/services/WebRTC';

import { mockMediaStream } from '@mocks/webRTC';

vi.mock('@business/services/WebRTC');

const renderUserStreamVideoRef = () => {
  const {
    result: {
      current: { localVideoRef, remoteVideoRef },
    },
    rerender,
  } = renderHook(() => useStreamVideoRef());

  return { localVideoRef, remoteVideoRef, rerender };
};

const initRemoteVideoRef = (remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>) => {
  act(() => {
    (remoteVideoRef.current as any) = document.createElement('video');
  });
};

const setRefToStrem = (ref: React.MutableRefObject<HTMLVideoElement | null>, stream: MediaStream) => {
  act(() => {
    (ref.current as any).srcObject = stream;
  });
};

const createMockMediaStream = (id: string) => ({ ...mockMediaStream, id });

describe('useStreamVideoRef 훅', () => {
  let webRTC: WebRTC;

  beforeEach(() => {
    vi.clearAllMocks();
    webRTC = WebRTC.getInstance();
  });

  describe('현재 remoteStream의 id가 변경되었을 때', () => {
    [
      {
        scenario: 'remoteVideoRef가 초기화 되지 않았으면 아무것도 하지안흠',
        mediaStream: mockMediaStream,
        willInitRemoteVideoRef: false,
        resultId: undefined,
      },
      {
        scenario: 'remoteStream이 없으면 아무것도 하지안흠',
        mediaStream: undefined,
        willInitRemoteVideoRef: true,
        resultId: undefined,
      },

      {
        scenario: 'remoteStream의 id가 변경되지 않았으면 useEffect를 실행하지 않는다',
        mediaStream: createMockMediaStream('sameId'),
        willInitRemoteVideoRef: true,
        resultMediaStream: createMockMediaStream('sameId'),
        resultId: 'sameId',
      },
      {
        scenario: 'remoteStream의 id가 변경되면 remoteVideoRef.srcObject를 새로운 remoteStream으로 변경한다',
        mediaStream: createMockMediaStream('oldId'),
        willInitRemoteVideoRef: true,
        resultMediaStream: createMockMediaStream('newId'),
        resultId: 'newId',
        runBeforeRerender: [
          () => {
            vi.spyOn(webRTC, 'getRemoteStream').mockReturnValue(createMockMediaStream('newId'));
          },
        ],
      },
    ].forEach(({ scenario, mediaStream, willInitRemoteVideoRef, runBeforeRerender, resultId }) => {
      it(scenario, () => {
        vi.spyOn(webRTC, 'getRemoteStream').mockReturnValue(mediaStream);

        const { remoteVideoRef, rerender } = renderUserStreamVideoRef();

        willInitRemoteVideoRef && initRemoteVideoRef(remoteVideoRef);
        runBeforeRerender?.[0]?.();
        rerender();

        expect((remoteVideoRef.current as any)?.srcObject?.id).toBe(resultId);
      });
    });
  });

  describe('remoteVideoRef가 변경되었을 때 (화면이 변경되어 새로운 remoteVideoRef가 들어올 때)', () => {
    [
      {
        scenario: 'remoteVideoRef가 초기화 되지 않았으면 아무것도 하지안흠',
        mediaStream: [mockMediaStream],
        willInitLocalVideoRef: false,
        resultId: undefined,
      },
      {
        scenario: 'remoteStream이 초기화 되지 않았으면 아무것도 하지안흠',
        mediaStream: [undefined],
        willInitLocalVideoRef: true,
        resultId: undefined,
      },
      {
        scenario: 'remoteStream의 id가 변경되지 않았으면 useEffect를 실행하지 않는다',
        mediaStream: [createMockMediaStream('sameId')],
        willInitLocalVideoRef: true,
        runBeforeRerender: [setRefToStrem],
        resultId: 'sameId',
      },
      {
        scenario: 'remoteStream의 id가 변경되면 remoteVideoRef.srcObject를 새로운 remoteStream으로 변경한다',
        mediaStream: [createMockMediaStream('oldId'), createMockMediaStream('newId')],
        willInitLocalVideoRef: true,
        runBeforeRerender: [setRefToStrem, setRefToStrem],
        resultId: 'newId',
      },
    ].forEach(({ scenario, mediaStream, willInitLocalVideoRef, runBeforeRerender, resultId }) => {
      it(scenario, () => {
        const { localVideoRef, rerender } = renderUserStreamVideoRef();

        willInitLocalVideoRef && initRemoteVideoRef(localVideoRef);
        runBeforeRerender?.[0]?.(localVideoRef, mediaStream?.[0]) && rerender();
        runBeforeRerender?.[1]?.(localVideoRef, mediaStream?.[1]) && rerender();

        expect((localVideoRef.current as any)?.srcObject?.id).toBe(resultId);
      });
    });
  });
});
