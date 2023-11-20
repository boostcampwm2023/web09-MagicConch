import { Icon } from '@iconify/react';

import Background from '@components/Background';
import ChatInput from '@components/ChatInput';
import ChatList from '@components/ChatList/ChatList';
import CustomButton from '@components/CustomButton';
import Header from '@components/Header';
import TarotSpread from '@components/TarotSpread';

import useOverlay from '@business/hooks/useOverlay';
import { useAiChat } from '@business/hooks/useAiChat';

interface AIChatPageProps {}

function AIChatPage({}: AIChatPageProps) {
  const { messages, messageStreaming, onSubmitMessage } = useAiChat();
  const { open } = useOverlay();

  // TODO: 테스트용
  const pickCard = (idx: number) => {
    console.log(idx);
  };

  const openTarotSpread = () => {
    open(({ opened, close }) => (
      <TarotSpread
        opened={opened}
        close={close}
        pickCard={pickCard}
      />
    ));
  };

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <CustomButton
            color="transparent"
            circle
            key="side-panel-close"
          >
            <Icon
              className="text-25"
              icon="carbon:side-panel-close"
            />
          </CustomButton>,
        ]}
      />

      {/* TEST 테스트용*/}
      <div className="absolute top-80 left-40">
        <CustomButton
          size="m"
          color="dark"
          handleButtonClicked={openTarotSpread}
        >
          타로 카드
        </CustomButton>
      </div>

      <div className="w-700 absolute top-95 h-3/4">
        <ChatList messages={messages} />

        {/* // TODO 서버에서 AI 데이터를 받아오고 있는 동안 disabled 하기 */}
        <ChatInput
          disabled={messageStreaming}
          sendChatMessage={onSubmitMessage}
        />
      </div>
    </Background>
  );
}

export default AIChatPage;
