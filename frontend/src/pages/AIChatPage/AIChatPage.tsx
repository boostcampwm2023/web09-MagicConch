import { ChatLogContainer } from '@components/aiChatPage';
import { Background, ChatContainer, Header } from '@components/common';
import { ContentAreaWithSideBar, SideBarButton } from '@components/common/SideBar';

import { useAiChatMessage } from '@business/hooks/chatMessage';
import { useAiTarotSpread } from '@business/hooks/tarotSpread';

interface AIChatPageProps {}

export function AIChatPage({}: AIChatPageProps) {
  const { messages, inputDisabled, onSubmitMessage, addPickCardMessage } = useAiChatMessage();
  useAiTarotSpread(addPickCardMessage);

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
      <ContentAreaWithSideBar sideBar={<ChatLogContainer />}>
        <div className="w-full h-full flex-with-center">
          <ChatContainer
            width="w-[80vw] max-w-700"
            height="h-full"
            messages={messages}
            inputDisabled={inputDisabled}
            onSubmitMessage={onSubmitMessage}
          />
        </div>
      </ContentAreaWithSideBar>
    </Background>
  );
}
