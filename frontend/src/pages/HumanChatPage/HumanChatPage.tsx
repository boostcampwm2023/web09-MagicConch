import { Dispatch, SetStateAction, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';
import { ContentAreaWithSideBar, SideBarButton } from '@components/SideBar';

import { useBlocker } from '@business/hooks/useBlocker';
import { useHumanChatMessage } from '@business/hooks/useChatMessage';
import { useHumanTarotSpread } from '@business/hooks/useTarotSpread';
import { useWebRTC } from '@business/hooks/useWebRTC';

import { ChatPageState, useHumanChatPageCreateRoomEvent } from './useHumanChatPageCreateRoomEvent';
import { useHumanChatPageWrongURL } from './useHumanChatPageWrongURL';

export interface OutletContext {
  tarotButtonClick: () => void;
  tarotButtonDisabled: boolean;
  chatPageState: ChatPageState;
  setChatPageState: Dispatch<SetStateAction<ChatPageState>>;
  disableSideBar: () => void;
  enableSideBar: () => void;
  unblockGoBack: () => void;
}

export default function HumanChatPage() {
  useHumanChatPageWrongURL();

  const navigate = useNavigate();
  const { endWebRTC } = useWebRTC();

  const { chatPageState, setChatPageState } = useHumanChatPageCreateRoomEvent();

  const { messages, onSubmitMessage, inputDisabled, addPickCardMessage } = useHumanChatMessage();
  const { tarotButtonClick, tarotButtonDisabled } = useHumanTarotSpread(addPickCardMessage);

  const { unblockGoBack } = useBlocker({
    when: ({ nextLocation }) => nextLocation.pathname === '/' || nextLocation.pathname === '/chat/human',
    onConfirm: () => navigate('/'),
  });

  useEffect(() => {
    return () => {
      endWebRTC();
    };
  }, []);

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <SideBarButton
            activeIcon="mdi:message"
            inactiveIcon="mdi:message-off"
          />,
        ]}
      />
      <ContentAreaWithSideBar
        sideBar={
          <ChatContainer
            width="w-400"
            height="h-full"
            messages={messages}
            onSubmitMessage={onSubmitMessage}
            inputDisabled={inputDisabled}
          />
        }
      >
        <Outlet
          context={{
            tarotButtonClick,
            tarotButtonDisabled,
            chatPageState,
            setChatPageState,
            unblockGoBack,
          }}
        />
      </ContentAreaWithSideBar>
    </Background>
  );
}
