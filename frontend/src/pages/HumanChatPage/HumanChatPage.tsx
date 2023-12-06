import { Dispatch, SetStateAction } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';
import SideBar from '@components/SideBar';

import { useBlocker } from '@business/hooks/useBlocker';
import { useHumanChatMessage } from '@business/hooks/useChatMessage';
import { useHumanTarotSpread } from '@business/hooks/useTarotSpread';
import useWebRTC from '@business/hooks/useWebRTC';

import { useHumanChatPageContentAnimation } from './useHumanChatPageContentAnimation';
import { ChatPageState, useHumanChatPageCreateRoomEvent } from './useHumanChatPageCreateRoomEvent';
import { useHumanChatPageWrongURL } from './useHumanChatPageWrongURL';

export interface OutletContext extends ReturnType<typeof useWebRTC> {
  tarotButtonClick: () => void;
  tarotButtonDisabled: boolean;
  chatPageState: ChatPageState;
  setChatPageState: Dispatch<SetStateAction<ChatPageState>>;
  unblockGoBack: () => void;
}

export default function HumanChatPage() {
  const webRTCData = useWebRTC();

  useHumanChatPageWrongURL();
  const { chatPageState, setChatPageState } = useHumanChatPageCreateRoomEvent();

  const { messages, onSubmitMessage, inputDisabled, addPickCardMessage } = useHumanChatMessage(webRTCData.chatChannel);
  const { tarotButtonClick, tarotButtonDisabled } = useHumanTarotSpread(webRTCData.chatChannel, addPickCardMessage);

  const { changeContentAnimation, contentAnimation } = useHumanChatPageContentAnimation();

  const navigate = useNavigate();
  const { unblockGoBack } = useBlocker({
    when: ({ nextLocation }) => nextLocation.pathname === '/' || nextLocation.pathname === '/chat/human',
    onConfirm: () => navigate('/'),
  });

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
          <Outlet
            context={{
              ...webRTCData,
              tarotButtonClick,
              tarotButtonDisabled,
              chatPageState,
              setChatPageState,
              unblockGoBack,
            }}
          />
        </div>
      </div>
    </Background>
  );
}
