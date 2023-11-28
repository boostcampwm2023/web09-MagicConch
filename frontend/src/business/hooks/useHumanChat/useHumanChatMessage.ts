import useChatMessage from '../useChatMessage';
import { useEffect } from 'react';

export default function useHumanChatMessage(
  tarotCardId: React.MutableRefObject<number | undefined>,
  chatChannel: React.MutableRefObject<RTCDataChannel | undefined>,
) {
  const { messages, addMessage } = useChatMessage(tarotCardId);

  const onSubmitMessage = (message: string) => {
    addMessage('right', message);
    chatChannel.current?.send(message);
  };

  useEffect(() => {
    if (chatChannel.current) {
      chatChannel.current.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        addMessage('left', data.message);
      };
    }
  }, [chatChannel.current]);

  return { messages, onSubmitMessage };
}
