import { useSocket } from '../useSocket';
import { useEffect, useState } from 'react';

import { Message, MessageButton } from '@components/ChatList';

export function useAiChatMessage(tarotCardId: React.MutableRefObject<number | undefined>) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const { socketEmit, socketOn } = useSocket('AIChat');

  const addMessage = (type: 'left' | 'right', message: string, button?: MessageButton) => {
    const tarotId = tarotCardId.current;
    tarotCardId.current = undefined;

    const profile = type == 'left' ? '/moon.png' : '/sponge.png';
    setMessages(messages => [...messages, { type, message, profile, tarotId, button }]);
  };

  const updateMessage = (message: string) => {
    setMessages(messages => [...messages.slice(0, -1), { ...messages[messages.length - 1], message }]);
  };

  const onSubmitMessage = (message: string) => {
    addMessage('right', message);
    socketEmit('message', message);
  };

  useEffect(() => {
    socketOn('streamStart', () => {
      setInputDisabled(true);
      addMessage('left', '');
    });
    socketOn('streaming', (message: string) => updateMessage(message));
    socketOn('streamEnd', () => setInputDisabled(false));

    socketOn('tarotCard', () => setInputDisabled(true));

    const requsetFeedbackMessage = '이번 상담은 어땠어?\n피드백을 남겨주면 내가 더 발전할 수 있어!';
    const button = { content: '피드백하기', onClick: () => {} };

    socketOn('chatEnd', (id: string) => {
      const shareLinkId: string = id;
      setMessages(messages => [...messages.slice(0, -1), { ...messages[messages.length - 1], shareLinkId }]);
      setTimeout(() => addMessage('left', requsetFeedbackMessage, button), 5000);
    });
  }, []);

  return { messages, inputDisabled, onSubmitMessage };
}
