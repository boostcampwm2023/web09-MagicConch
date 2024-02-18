import { CamBox } from '..';
import { useOutletContext } from 'react-router-dom';

import { OutletContext } from '@pages/HumanChatPage';

import { IconButton, IconToggleButton } from '@components/common/Buttons';

import { useMediaStream } from '@business/hooks/webRTC';

import { useMediaInfo, useProfileInfo } from '@stores/zustandStores';

import { DEFAULT_NICKNAME } from '@constants/nickname';

interface CamContainerProps {
  tarotButtonClick: () => void;
  tarotButtonDisabled: boolean;
}

export function CamContainer({ tarotButtonClick, tarotButtonDisabled }: CamContainerProps) {
  const { host } = useOutletContext<OutletContext>();

  const { myNickname, myProfile, remoteNickname, remoteProfile } = useProfileInfo(state => ({
    myNickname: state.myNickname,
    myProfile: state.myProfile,
    remoteNickname: state.remoteNickname,
    remoteProfile: state.remoteProfile,
  }));

  const { myVideoOn, myMicOn, remoteMicOn, remoteVideoOn } = useMediaInfo(state => ({
    myVideoOn: state.myVideoOn,
    myMicOn: state.myMicOn,
    remoteMicOn: state.remoteMicOn,
    remoteVideoOn: state.remoteVideoOn,
    setRemoteMicOn: state.setRemoteMicOn,
    setRemoteVideoOn: state.setRemoteVideoOn,
  }));

  const { localStream, remoteStream, toggleMediaOnOff } = useMediaStream();

  return (
    <div className="flex-with-center flex-col gap-80 pt-80 sm:gap-20">
      <div className="flex justify-center gap-64 sm:flex-col sm:gap-20">
        <CamBox
          stream={localStream}
          cameraConnected={myVideoOn}
          audioConnected={myMicOn}
          defaultImage="bg-ddung"
          profileInfo={myProfile}
          nickname={myNickname}
          defaultNickname={DEFAULT_NICKNAME.ME}
        />
        <CamBox
          stream={remoteStream}
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
            onClick={() => toggleMediaOnOff('video')}
          />
          <IconToggleButton
            activeIcon="mingcute:mic-line"
            inactiveIcon="mingcute:mic-off-line"
            size="l"
            active={myMicOn}
            onClick={() => toggleMediaOnOff('audio')}
          />
        </div>
      </div>
    </div>
  );
}
