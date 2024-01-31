import { IconButton, IconToggleButton } from '@components/Buttons';
import CamBox from '@components/CamBox';

import { useHost } from '@stores/zustandStores/useHost';
import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';
import { useProfileInfo } from '@stores/zustandStores/useProfileInfo';

import { DEFAULT_NICKNAME } from '@constants/nickname';

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

  const { host } = useHost(state => ({ host: state.host }));

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
          defaultNickname={DEFAULT_NICKNAME.ME}
        />
        <CamBox
          videoRef={remoteVideoRef}
          cameraConnected={remoteVideoOn}
          audioConnected={remoteMicOn}
          defaultImage="bg-sponge"
          profileInfo={remoteProfile}
          nickname={remoteNickname}
          defaultNickname={DEFAULT_NICKNAME.OTHER}
        />
      </div>
      <div className="flex-with-center flex-col gap-30 z-10">
        {host && (
          <IconButton
            icon="tabler:cards-filled"
            onClick={tarotButtonClick}
            disabled={tarotButtonDisabled}
          >
            타로 카드 펼치기
          </IconButton>
        )}
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
