import { ChatLogContainer } from '@components/aiChatPage';
import { Background, ChatContainer, Header } from '@components/common';
import { SideBarButton } from '@components/common/SideBar';

import { useAiChatMessage } from '@business/hooks/chatMessage';
import { useSidebar } from '@business/hooks/sidebar';
import { useAiTarotSpread } from '@business/hooks/tarotSpread';

import { getAuthorizedQuery } from '@stores/queries/getAuthorizedQuery';

interface AIChatPageProps {}

export function AIChatPage({}: AIChatPageProps) {
  const { messages, inputDisabled, onSubmitMessage, addPickCardMessage } = useAiChatMessage();
  useAiTarotSpread(addPickCardMessage);

  const { toggleSidebar, sidebarOpened, Sidebar, SlideableContent } = useSidebar();

  const { error, data, isLoading } = getAuthorizedQuery();

  if (isLoading || error || !data?.isAuthenticated) {
    return (
      <Background type="dynamic">
        <Header />
        <div className="w-h-full p-[5%] lg:pl-[25%] lg:pr-[25%]">
          <ChatContainer
            messages={messages}
            inputDisabled={inputDisabled}
            onSubmitMessage={onSubmitMessage}
          />
        </div>
      </Background>
    );
  }

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
      <SlideableContent>
        <div className="w-h-full p-[5%] lg:pl-[25%] lg:pr-[25%]">
          <ChatContainer
            messages={messages}
            inputDisabled={inputDisabled}
            onSubmitMessage={onSubmitMessage}
          />
        </div>
      </SlideableContent>
      <Sidebar>
        <ChatLogContainer />
      </Sidebar>
    </Background>
  );
}
