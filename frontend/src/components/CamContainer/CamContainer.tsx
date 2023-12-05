import { IconButton, IconToggleButton } from '@components/Buttons';
import CamBox from '@components/CamBox';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';
import { useProfileInfo } from '@stores/zustandStores/useProfileInfo';

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
      <div className="flex flex-col gap-30 z-10">
        <IconButton
          icon="tabler:cards-filled"
          onClick={tarotButtonClick}
          disabled={tarotButtonDisabled}
        >
          타로 카드 펼치기
        </IconButton>
        <div className="z-10 flex-with-center gap-48">
          <IconToggleButton
            activeIcon="pepicons-pop:camera"
            inactiveIcon="pepicons-pop:camera-off"
            size="l"
            active={myVideoOn}
            onClick={toggleVideo}
          />
          <IconToggleButton
            activeIcon="mingcute:mic-line"
            inactiveIcon="mingcute:mic-off-line"
            size="l"
            active={myMicOn}
            onClick={toggleAudio}
          />
        </div>
      </div>
    </div>
  );
}
