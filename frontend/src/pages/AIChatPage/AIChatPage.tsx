import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import ChatLogContainer from '@components/ChatLogContainer';
import Header from '@components/Header';
import { ContentAreaWithSideBar, SideBarButton } from '@components/SideBar';

import { useAiChatMessage } from '@business/hooks/useChatMessage';
import { useAiTarotSpread } from '@business/hooks/useTarotSpread';

interface AIChatPageProps {}

function AIChatPage({}: AIChatPageProps) {
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

export default AIChatPage;
