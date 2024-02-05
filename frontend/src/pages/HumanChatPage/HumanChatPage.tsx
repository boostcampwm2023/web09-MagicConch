import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Background, ChatContainer, Header } from '@components/common';
import { ContentAreaWithSideBar, SideBarButton } from '@components/common/SideBar';

import { useHumanChatMessage } from '@business/hooks/chatMessage';
import { useHumanTarotSpread } from '@business/hooks/tarotSpread';
import { useBlocker } from '@business/hooks/useBlocker';
import { useWebRTC } from '@business/hooks/webRTC';

import { useCreateRoomEvent } from './hooks/useCreateRoomEvent';
import { useHumanChatPageState } from './hooks/useHumanChatPageState';
import { usePageWrongURL } from './hooks/usePageWrongURL';

type HumanChatPageState = ReturnType<typeof useHumanChatPageState>;

export interface OutletContext extends HumanChatPageState {
  tarotButtonClick: () => void;
  tarotButtonDisabled: boolean;
  disableSideBar: () => void;
  enableSideBar: () => void;
  unblockGoBack: () => void;
}

export function HumanChatPage() {
  const humanChatPageState = useHumanChatPageState();

  usePageWrongURL();
  useCreateRoomEvent({ ...humanChatPageState });

  const navigate = useNavigate();
  const { endWebRTC } = useWebRTC();

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
            unblockGoBack,
            ...humanChatPageState,
          }}
        />
      </ContentAreaWithSideBar>
    </Background>
  );
}
