import useChatMessage from '../useChatMessage';
import { useEffect } from 'react';

export default function useHumanChatMessage(tarotCardId: React.MutableRefObject<number | undefined>) {
  const { messages, addMessage } = useChatMessage(tarotCardId);

  const onSubmitMessage = (message: string) => {
    addMessage('right', message);
    // 상대한테도 전송
  };

  useEffect(() => {}, []);

  return { messages, onSubmitMessage };
}
