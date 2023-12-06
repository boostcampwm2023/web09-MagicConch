import { useNavigate, useOutletContext } from 'react-router-dom';

import { IconButton } from '@components/Buttons';
import CamContainer from '@components/CamContainer';

import { useBlocker } from '@business/hooks/useBlocker';
import useSpeakerHighlighter from '@business/hooks/useSpeakerHighlighter';

import type { OutletContext } from './HumanChatPage';
import { useChattingPageCreateJoinRoom } from './useChattingPageCreateJoinRoom';

export default function ChattingPage() {
  const {
    localVideoRef,
    remoteVideoRef,
    tarotButtonDisabled,
    toggleVideo,
    toggleAudio,
    tarotButtonClick,
  }: OutletContext = useOutletContext();

  const { unblockGoBack } = useBlocker({
    when: ({ nextLocation }) => nextLocation.pathname === '/' || nextLocation.pathname === '/chat/human',
    onConfirm: () => navigate('/'),
  });

  useChattingPageCreateJoinRoom({ unblockGoBack });

  useSpeakerHighlighter(localVideoRef);
  useSpeakerHighlighter(remoteVideoRef);

  const navigate = useNavigate();
  const goSettingPage = () => navigate('setting');

  return (
    <>
      <CamContainer
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        tarotButtonClick={tarotButtonClick}
        tarotButtonDisabled={tarotButtonDisabled}
      />
      <div className="absolute top-[10vh] right-90">
        <IconButton
          icon="uil:setting"
          iconColor="textWhite"
          buttonColor="cancel"
          onClick={goSettingPage}
        />
      </div>
    </>
  );
}
