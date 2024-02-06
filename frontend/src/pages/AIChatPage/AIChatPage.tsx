import { ChatLogContainer } from '@components/aiChatPage';
import { Background, ChatContainer, Header } from '@components/common';
import { SideBar, SideBarButton } from '@components/common/SideBar';

import { useAiChatMessage } from '@business/hooks/chatMessage';
import { useSidebar } from '@business/hooks/sidebar';
import { useAiTarotSpread } from '@business/hooks/tarotSpread';

interface AIChatPageProps {}

export function AIChatPage({}: AIChatPageProps) {
  const { toggleSidebar, mainRef, sidebarRef, sidebarOpened } = useSidebar();

  const { messages, inputDisabled, onSubmitMessage, addPickCardMessage } = useAiChatMessage();
  useAiTarotSpread(addPickCardMessage);

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <SideBarButton
            onClick={toggleSidebar}
            sideBarOpened={sidebarOpened}
          />,
        ]}
      />
      <ChatContainer
        ref={mainRef}
        width="w-[80vw] max-w-700"
        height="h-full"
        messages={messages}
        inputDisabled={inputDisabled}
        onSubmitMessage={onSubmitMessage}
      />
      <SideBar ref={sidebarRef}>
        <ChatLogContainer />
      </SideBar>
    </Background>
  );
}
