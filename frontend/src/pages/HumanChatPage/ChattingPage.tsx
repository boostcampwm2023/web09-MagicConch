import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { IconButton } from '@components/Buttons';
import CamContainer from '@components/CamContainer';

import { useControllMedia, useStreamVideoRef } from '@business/hooks/useWebRTC';

import { useHumanChatPage } from '@stores/zustandStores/useHost';

import type { OutletContext } from './HumanChatPage';
import { useChattingPageCreateJoinRoomPasswordPopup } from './useChattingPageCreateJoinRoomPopup';

export function ChattingPage() {
  const { tarotButtonDisabled, tarotButtonClick, unblockGoBack }: OutletContext = useOutletContext();

  useChattingPageCreateJoinRoomPasswordPopup({ unblockGoBack });
  const { localVideoRef, remoteVideoRef } = useStreamVideoRef();
  const { toggleAudio, toggleVideo, changeMyVideoTrack } = useControllMedia({ localVideoRef });

  const { joined } = useHumanChatPage(state => ({ joined: state.joined }));

  useEffect(() => {
    if (joined) {
      changeMyVideoTrack();
    }
  }, [joined]);

  const navigate = useNavigate();
  const goSettingPage = () => navigate('setting');
  console.log('chattingpage renderred', joined);

  return (
    <div className={joined ? 'flex-with-center' : 'hidden'}>
      <CamContainer
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        tarotButtonClick={tarotButtonClick}
        tarotButtonDisabled={tarotButtonDisabled}
      />
      <div className="absolute z-10 top-[10vh] right-90">
        <IconButton
          icon="uil:setting"
          iconColor="textWhite"
          buttonColor="cancel"
          onClick={goSettingPage}
        />
      </div>
    </div>
  );
}
