import { useDataChannelEventListener } from '../useDataChannelEventListener';
import { act, renderHook } from '@testing-library/react';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';
import { useProfileInfo } from '@stores/zustandStores/useProfileInfo';

describe('useDataChannelEventListener 훅 테스트', () => {
  function rerenderHook() {
    const {
      result: {
        current: {
          sendMyNickname,
          sendMyProfileImage,
          sendNowMediaStates,
          setMediaStates,
          setRemoteNicknameState,
          setRemoteProfileImageState,
        },
      },
      rerender,
    } = renderHook(() => useDataChannelEventListener());

    return {
      rerender,
      sendMyNickname,
      sendMyProfileImage,
      sendNowMediaStates,
      setMediaStates,
      setRemoteNicknameState,
      setRemoteProfileImageState,
    };
  }

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('test', () => {
    // const a = new MediaStream();
    // console.log(a);
    expect(1).toBe(1);
  });
  describe(`setMediaStates 함수 테스트`, () => {
    [
      {
        scenario: 'type === video라면 onOrOff와 함께 setRemoteVideoOn 호출 (상대 비디오 상태 설정)',
        data: JSON.stringify([
          { type: 'video', onOrOff: true },
          { type: 'video', onOrOff: false },
        ]),
      },
      {
        scenario: 'type === audio라면 onOrOff와 함께 setMicOn 호출 (상대 마이크 상태 설정)',
        data: JSON.stringify([
          { type: 'audio', onOrOff: true },
          { type: 'audio', onOrOff: false },
        ]),
      },
    ].forEach(({ scenario, data }) => {
      it(scenario, () => {
        const spySetRemoteMicOn = vi.spyOn(useMediaInfo.getState(), 'setRemoteMicOn');
        const spySetRemoteVideoOn = vi.spyOn(useMediaInfo.getState(), 'setRemoteVideoOn');
        const { setMediaStates } = rerenderHook();
        const parsedData = JSON.parse(data);

        act(() => {
          setMediaStates({ ev: { data } } as any);
        });
        parsedData.forEach(({ type, onOrOff }: { type: string; onOrOff: boolean }) => {
          if (type === 'audio') {
            expect(spySetRemoteMicOn).toBeCalledWith(onOrOff);
          } else if (type === 'video') {
            expect(spySetRemoteVideoOn).toBeCalledWith(onOrOff);
          }
        });
      });
    });
  });

  describe('setRemoteProfileImageState 함수 테스트', () => {
    it('인수로 들어온 파일을 상대의 프로필 사진으로 설정함', () => {
      const spySetRemoteProfileImage = vi.spyOn(useProfileInfo.getState(), 'setRemoteProfile');
      const arrayBuffer = new ArrayBuffer(8);
      const type = 'image/png';
      const ev = { data: JSON.stringify({ type, arrayBuffer: new Uint8Array(arrayBuffer) }) } as any as MessageEvent;

      const { setRemoteProfileImageState } = rerenderHook();

      act(() => {
        setRemoteProfileImageState({ ev });
      });

      expect(spySetRemoteProfileImage).toBeCalledWith({ arrayBuffer, type });
    });
  });

  describe('setRemoteNicknameState 함수 테스트', () => {
    it('인수로 들어온 닉네임을 상대의 닉네임으로 설정함', () => {
      const spySetRemoteNickname = vi.spyOn(useProfileInfo.getState(), 'setRemoteNickname');
      const ev = { data: 'testNickName' } as any as MessageEvent;

      const { setRemoteNicknameState } = rerenderHook();

      act(() => {
        setRemoteNicknameState({ ev });
      });

      expect(spySetRemoteNickname).toBeCalledWith('testNickName');
    });
  });

  describe('sendNowMediaStates 함수 테스트', () => {
    [
      {
        scenario: '현재 비디오 트랙이 꺼져있다면, 비디오 트랙을 전송하지 않음',
        audioTrack: { enabled: true },
        videoTrack: { enabled: false },
      },
      {
        scenario: '현재 오디오 트랙이 꺼져있다면, 오디오 트랙을 전송하지 않음',
        audioTrack: { enabled: false },
        videoTrack: { enabled: true },
      },
      {
        scenario: '현재 오디오 트랙, 비디오 트랙이 모두 켜져있다면, 오디오 트랙, 비디오 트랙을 전송함',
        audioTrack: { enabled: true },
        videoTrack: { enabled: true },
      },
    ].forEach(({ scenario, audioTrack, videoTrack }) => {
      it(scenario, () => {
        vi.spyOn(useMediaInfo.getState(), 'myVideoOn', 'get').mockReturnValueOnce(videoTrack.enabled);
        vi.spyOn(useMediaInfo.getState(), 'myMicOn', 'get').mockReturnValueOnce(audioTrack.enabled);

        const RTCDataChannelSendFn = vi.fn();

        const { sendNowMediaStates } = rerenderHook();

        sendNowMediaStates.call({ send: RTCDataChannelSendFn } as any);

        expect(RTCDataChannelSendFn).toBeCalledWith(
          JSON.stringify([
            { type: 'video', onOrOff: videoTrack.enabled },
            { type: 'audio', onOrOff: audioTrack.enabled },
          ]),
        );
      });
    });
  });

  describe('sendMyProfileImage 함수 테스트', () => {
    [
      {
        scenario: '내 프로필 사진이 존재한다면, 내 프로필 사진을 전송함',
        myProfile: { arrayBuffer: new ArrayBuffer(8), type: 'image/png' },
      },
      {
        scenario: '내 프로필 사진이 존재하지 않는다면, 내 프로필 사진을 전송하지 않음',
        myProfile: undefined,
      },
    ].forEach(({ scenario, myProfile }) => {
      it(scenario, () => {
        useProfileInfo.getState().setMyProfile(myProfile as any);
        vi.spyOn(useProfileInfo.getState(), 'myProfile', 'get')?.mockReturnValueOnce(myProfile);
        const RTCDataChannelSendFn = vi.fn();

        const { sendMyProfileImage } = rerenderHook();

        act(() => {
          sendMyProfileImage.call({ send: RTCDataChannelSendFn } as any);
        });

        if (myProfile) {
          expect(RTCDataChannelSendFn).toBeCalledWith(JSON.stringify({ myProfile }));
        } else {
          expect(RTCDataChannelSendFn).not.toBeCalled();
        }
      });
    });
  });

  describe('sendMyNickname 함수 테스트', () => {
    [
      {
        scenario: '내 닉네임이 존재한다면, 내 닉네임을 전송함',
        myNickname: 'testNickName',
      },
      {
        scenario: '내 닉네임이 존재하지 않는다면, 내 닉네임을 전송하지 않음',
        myNickname: undefined,
      },
    ].forEach(({ scenario, myNickname }) => {
      it(scenario, () => {
        useProfileInfo.getState().setMyNickname(myNickname as any);
        vi.spyOn(useProfileInfo.getState(), 'myNickname', 'get').mockReturnValueOnce(myNickname);
        const RTCDataChannelSendFn = vi.fn();

        const { sendMyNickname } = rerenderHook();

        act(() => {
          sendMyNickname.call({ send: RTCDataChannelSendFn } as any);
        });

        if (myNickname) {
          expect(RTCDataChannelSendFn).toBeCalledWith(myNickname);
        } else {
          expect(RTCDataChannelSendFn).not.toBeCalled();
        }
      });
    });
  });
});
