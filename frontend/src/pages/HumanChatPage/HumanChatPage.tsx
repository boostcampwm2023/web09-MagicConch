import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Background, ChatContainer, Header } from '@components/common';
import { SideBarButton } from '@components/common/SideBar';

import { useHumanChatMessage } from '@business/hooks/chatMessage';
import { useSidebar } from '@business/hooks/sidebar';
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

  const { toggleSidebar, sidebarOpened, Sidebar, SlideableContent } = useSidebar();

  useEffect(() => {
    return () => {
      endWebRTC();
    };
  }, []);

  return (
    <>
      <Background type="dynamic" />
      <main className="flex-with-center flex-col w-screen h-dvh">
        <Header
          rightItems={[
            <SideBarButton
              onClick={toggleSidebar}
              sideBarOpened={sidebarOpened}
            />,
          ]}
        />
        <SlideableContent>
          <Outlet
            context={{
              tarotButtonClick,
              tarotButtonDisabled,
              unblockGoBack,
              ...humanChatPageState,
            }}
          />
        </SlideableContent>
        <Sidebar>
          <ChatContainer
            messages={messages}
            inputDisabled={inputDisabled}
            onSubmitMessage={onSubmitMessage}
          />
        </Sidebar>
      </main>
    </>
  );
}
