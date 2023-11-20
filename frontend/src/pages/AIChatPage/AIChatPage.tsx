import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

import Background from '@components/Background';
import ChatInput from '@components/ChatInput';
import ChatList, { Message } from '@components/ChatList/ChatList';
import CustomButton from '@components/CustomButton';
import Header from '@components/Header';
import TarotSpread from '@components/TarotSpread';

import useOverlay from '@business/hooks/useOverlay';
import { sendMessage, setMessageEventListener } from '@business/services/socket';

interface AIChatPageProps {}

function AIChatPage({}: AIChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { open } = useOverlay();
  const [btnDisabled, setBtnDisabled] = useState(true); // TODO: 테스트용

  const addMessage = (type: 'left' | 'right', message: string) => {
    const profile = type == 'left' ? '/moon.png' : '/sponge.png';
    // 임시로 랜덤으로 타로 카드 뽑기
    const tarotId = String(Math.floor(Math.random() * 22)).padStart(2, '0');
    setMessages(messages => [...messages, { type, message, profile, tarotId }]);
  };

  const onSubmitMessage = (message: string) => {
    addMessage('right', message);
    sendMessage(message);
  };

  // TODO: 테스트용
  const pickCard = (idx: number) => {
    setMessages(messages => [
      ...messages,
      { type: 'left', message: '테스트', profile: '/moon.png', tarotId: idx.toString().padStart(2, '0') },
    ]);
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

  useEffect(() => {
    setMessageEventListener(message => {
      addMessage('left', message);
      setBtnDisabled(false); // TODO: 테스트용
    });
  }, []);

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <CustomButton
            color="transparent"
            size="s"
            key="side-panel-close"
          >
            <Icon
              className="w-22 h-22"
              icon="carbon:side-panel-close"
            />
          </CustomButton>,
        ]}
      />

      {/* TEST 테스트용*/}
      <div className="absolute top-80 left-40">
        <CustomButton
          disabled={btnDisabled}
          size="m"
          color="active"
          handleButtonClicked={openTarotSpread}
        >
          타로 카드 뽑기
        </CustomButton>
      </div>

      <div className="w-700 absolute top-95 h-3/4">
        <ChatList messages={messages} />

        {/* // TODO 서버에서 AI 데이터를 받아오고 있는 동안 disabled 하기 */}
        <ChatInput
          disabled={false}
          sendChatMessage={onSubmitMessage}
        />
      </div>
    </Background>
  );
}

export default AIChatPage;
