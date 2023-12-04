import { useEffect, useState } from 'react';

import { useSocket } from '@business/hooks/useSocket';
import useTOLD from '@business/hooks/useTOLD';

import useChatMessage from './useChatMessage';

export function useAiChatMessage() {
  const { messages, addMessage, updateMessage } = useChatMessage();
  const [inputDisabled, setInputDisabled] = useState(true);
  const { socketEmit, socketOn } = useSocket('AIChat');

  const { displayTold } = useTOLD('AI');

  const onSubmitMessage = (message: string) => {
    addMessage('right', { message });
    socketEmit('message', message);
  };

  useEffect(() => {
    socketOn('streamStart', () => {
      setInputDisabled(true);
      addMessage('left', { message: '' });
    });
    socketOn('streaming', (text: string) => updateMessage(message => ({ ...message, message: text })));
    socketOn('streamEnd', () => setInputDisabled(false));

    socketOn('tarotCard', () => setInputDisabled(true));

    const requestFeedbackMessage = '이번 상담은 어땠어?\n피드백을 남겨주면 내가 더 발전할 수 있어!';
    const button = { content: '피드백하기', onClick: displayTold };

    socketOn('chatEnd', (id: string) => {
      const shareLinkId: string = id;
      updateMessage(message => ({ ...message, shareLinkId }));
      setTimeout(() => addMessage('left', { message: requestFeedbackMessage, button }), 5000);
    });
  }, []);

  const addPickCardMessage = (tarotId: number) => {
    addMessage('left', { tarotId });
  };

  return { messages, inputDisabled, onSubmitMessage, addPickCardMessage };
}
