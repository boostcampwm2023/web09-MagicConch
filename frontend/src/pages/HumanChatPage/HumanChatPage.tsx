import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';
import SideBar from '@components/SideBar';

import { useHumanChatMessage } from '@business/hooks/useChatMessage';
import { useHumanTarotSpread } from '@business/hooks/useTarotSpread';
import { useWebRTC } from '@business/hooks/useWebRTC';

export interface OutletContext extends ReturnType<typeof useWebRTC> {
  tarotButtonClick: () => void;
  tarotButtonDisabled: boolean;
}

export default function HumanChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const webRTCData = useWebRTC();
  const { roomName } = useParams();

  useEffect(() => {
    if (!roomName && !location.state?.host) {
      alert('잘못된 접근입니다.');
      navigate('/');
    }

    if (roomName || !location.state?.host) {
      return;
    }

    webRTCData.createRoom({
      onSuccess: ({ roomName, close }) => {
        close();
        navigate(roomName, { state: { host: true } });
      },
      onClose: ({ close }) => {
        close();
        navigate('/');
      },
    });
  }, []);

  const { messages, onSubmitMessage, inputDisabled, addPickCardMessage } = useHumanChatMessage(webRTCData.chatChannel);
  const { tarotButtonClick, tarotButtonDisabled } = useHumanTarotSpread(webRTCData.chatChannel, addPickCardMessage);

  const [contentAnimation, setContentAnimation] = useState<string>('');

  const changeContentAnimation = (opendSidebar: boolean) => {
    const newAnimation = opendSidebar
      ? 'animate-contentSideWithOpeningSidebar'
      : 'animate-contentSideWithClosingSidebar';

    setContentAnimation(newAnimation);
  };

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <SideBar
            key="chat-side-bar"
            onSide={changeContentAnimation}
            icon={{ open: 'mdi:message-off', close: 'mdi:message' }}
          >
            <ChatContainer
              width="w-[90%]"
              height="h-[80%]"
              position="top-[5vh]"
              messages={messages}
              onSubmitMessage={onSubmitMessage}
              inputDisabled={inputDisabled}
            />
          </SideBar>,
        ]}
      />
      <div className="w-h-screen">
        <div className={`flex-with-center h-full ${contentAnimation}`}>
          <Outlet context={{ ...webRTCData, tarotButtonClick, tarotButtonDisabled }} />
        </div>
      </div>
    </Background>
  );
}
