import { Dispatch, SetStateAction, useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';
import SideBar from '@components/SideBar';

import { useHumanChatMessage } from '@business/hooks/useChatMessage';
import { useHumanTarotSpread } from '@business/hooks/useTarotSpread';
import useWebRTC from '@business/hooks/useWebRTC';
import { HumanSocketManager } from '@business/services/SocketManager';

import { useHumanChatPageSocket } from './useHumanChatPageSocket';

interface ChatPageState {
  joined: boolean;
  host: boolean;
}
export interface OutletContext extends ReturnType<typeof useWebRTC> {
  tarotButtonClick: () => void;
  tarotButtonDisabled: boolean;
  chatPageState: ChatPageState;
  setChatPageState: Dispatch<SetStateAction<ChatPageState>>;
}

export default function HumanChatPage() {
  const location = useLocation();
  const webRTCData = useWebRTC();
  const { roomName } = useParams();

  const { chatPageState, setChatPageState } = useHumanChatPageSocket(roomName, location.state?.host);

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
          <Outlet context={{ ...webRTCData, tarotButtonClick, tarotButtonDisabled, chatPageState, setChatPageState }} />
        </div>
      </div>
    </Background>
  );
}
