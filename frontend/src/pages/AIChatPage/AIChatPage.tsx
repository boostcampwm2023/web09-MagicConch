import { ChatLogContainer } from '@components/aiChatPage';
import { Background, ChatContainer, Header } from '@components/common';
import { SideBarButton } from '@components/common/SideBar';

import { useAiChatMessage } from '@business/hooks/chatMessage';
import { useSidebar } from '@business/hooks/sidebar';
import { useAiTarotSpread } from '@business/hooks/tarotSpread';

import { getAuthorizedQuery } from '@stores/queries';

interface AIChatPageProps {}

export function AIChatPage({}: AIChatPageProps) {
  const { messages, inputDisabled, onSubmitMessage, addPickCardMessage } = useAiChatMessage();
  useAiTarotSpread(addPickCardMessage);

  const { toggleSidebar, sidebarOpened, Sidebar } = useSidebar();

  const { data } = getAuthorizedQuery();

  return (
    <>
      <Background type="dynamic" />
      <main className="flex-with-center flex-col w-screen h-dvh">
        <Header
          rightItems={
            data?.isAuthenticated
              ? [
                  <SideBarButton
                    onClick={toggleSidebar}
                    sideBarOpened={sidebarOpened}
                  />,
                ]
              : []
          }
        />
        <div className="w-h-full pl-[5%] pr-[5%] pb-[5%] lg:pl-[25%] lg:pr-[25%]">
          <ChatContainer
            messages={messages}
            inputDisabled={inputDisabled}
            onSubmitMessage={onSubmitMessage}
          />
        </div>
        {data?.isAuthenticated && (
          <Sidebar>
            <ChatLogContainer />
          </Sidebar>
        )}
      </main>
    </>
  );
}
