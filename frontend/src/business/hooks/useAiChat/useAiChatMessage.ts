import { useEffect, useState } from 'react';

import { Message, MessageButton } from '@components/ChatList';

import { aiSocketEmit, aiSocketOn } from '@business/services/socket';

export function useAiChatMessage(tarotCardId: React.MutableRefObject<string | undefined>) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);

  const addMessage = (type: 'left' | 'right', message: string, button?: MessageButton) => {
    const tarotId = tarotCardId.current;
    tarotCardId.current = undefined;

    const profile = type == 'left' ? '/moon.png' : '/sponge.png';
    setMessages(messages => [...messages, { type, message, profile, tarotId, button }]);
  };

  const updateMessage = (token: string) => {
    setMessages(messages => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.message === '...') {
        lastMessage.message = '';
      }
      lastMessage.message = lastMessage.message + token;
      return messages;
    });
  };

  const onSubmitMessage = (message: string) => {
    addMessage('right', message);
    aiSocketEmit('message', message);
  };

  useEffect(() => {
    aiSocketOn('streamStart', () => {
      setInputDisabled(true);
      addMessage('left', '...');
    });
    aiSocketOn('streaming', token => updateMessage(token as string));
    aiSocketOn('streamEnd', () => setInputDisabled(false));

    aiSocketOn('tarotCard', () => setInputDisabled(true));

    const requsetFeedbackMessage = '이번 상담은 어땠어?\n피드백을 남겨주면 내가 더 발전할 수 있어!';
    const button = { content: '피드백하기', onClick: () => alert('👩‍🔧') };

    aiSocketOn('chatEnd', shareLinkId => {
      console.log(shareLinkId);
      setTimeout(() => addMessage('left', requsetFeedbackMessage, button));
    });
  }, []);

  return { messages, inputDisabled, onSubmitMessage };
}
