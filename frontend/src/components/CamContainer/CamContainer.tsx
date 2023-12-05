import { CustomButton, IconToggleButton } from '@components/Buttons';
import CamBox from '@components/CamBox';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';
import { useProfileInfo } from '@stores/zustandStores/useProfileInfo';

import { Icon } from '@iconify/react/dist/iconify.js';

interface CamContainerProps {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  toggleVideo: () => void;
  toggleAudio: () => void;
  tarotButtonClick: () => void;
  tarotButtonDisabled: boolean;
}

export default function CamContainer({
  localVideoRef,
  remoteVideoRef,
  toggleVideo,
  toggleAudio,
  tarotButtonClick,
  tarotButtonDisabled,
}: CamContainerProps) {
  const { myNickname, myProfile, remoteNickname, remoteProfile } = useProfileInfo(state => ({
    myNickname: state.myNickname,
    myProfile: state.myProfile,
    remoteNickname: state.remoteNickname,
    remoteProfile: state.remoteProfile,
  }));

  const { myMicOn, myVideoOn, remoteMicOn, remoteVideoOn } = useMediaInfo(state => ({
    myMicOn: state.myMicOn,
    myVideoOn: state.myVideoOn,
    remoteMicOn: state.remoteMicOn,
    remoteVideoOn: state.remoteVideoOn,
    setRemoteMicOn: state.setRemoteMicOn,
    setRemoteVideoOn: state.setRemoteVideoOn,
  }));

  return (
    <div className="flex-with-center flex-col gap-80 pt-80 sm:gap-20">
      <div className="flex justify-center gap-64 sm:flex-col sm:gap-20">
        <CamBox
          videoRef={localVideoRef}
          cameraConnected={myVideoOn}
          audioConnected={myMicOn}
          defaultImage="bg-ddung"
          profileInfo={myProfile}
          nickname={myNickname}
          defaultNickname="나"
        />
        <CamBox
          videoRef={remoteVideoRef}
          cameraConnected={remoteVideoOn}
          audioConnected={remoteMicOn}
          defaultImage="bg-sponge"
          profileInfo={remoteProfile}
          nickname={remoteNickname}
          defaultNickname="상대방"
        />
      </div>
      <div className="z-10 flex flex-col gap-30">
        <CustomButton
          size="m"
          onClick={tarotButtonClick}
          disabled={tarotButtonDisabled}
          color={tarotButtonDisabled ? 'disabled' : 'active'}
        >
          <Icon
            width="17"
            height="17"
            icon="tabler:cards-filled"
          />
          타로 카드 펼치기
        </CustomButton>
        <div className="z-10 flex-with-center gap-48">
          <IconToggleButton
            activeIcon="pepicons-pop:camera"
            disabledIcon="pepicons-pop:camera-off"
            iconSize={28}
            buttonSize="l"
            active={myVideoOn}
            onClick={toggleVideo}
          />
          <IconToggleButton
            activeIcon="mingcute:mic-line"
            disabledIcon="mingcute:mic-off-line"
            iconSize={28}
            buttonSize="l"
            active={myMicOn}
            onClick={toggleAudio}
          />
        </div>
      </div>
    </div>
  );
}
