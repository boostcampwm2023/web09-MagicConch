import { useEffect, useState } from 'react';

import useTOLD from '@business/hooks/useTOLD';
import { AISocketManager } from '@business/services/SocketManager';

import useChatMessage from './useChatMessage';

export function useAiChatMessage() {
  const socketManager = new AISocketManager();

  const { messages, addMessage, updateMessage } = useChatMessage();
  const [inputDisabled, setInputDisabled] = useState(true);

  const { displayTold } = useTOLD('AI');

  const onSubmitMessage = (message: string) => {
    addMessage('right', { message });
    socketManager.emit('message', message);
  };

  useEffect(() => {
    socketManager.connect();

    socketManager.on('streamStart', () => {
      setInputDisabled(true);
      addMessage('left', { message: '' });
    });
    socketManager.on('streaming', (text: string) => updateMessage(message => ({ ...message, message: text })));
    socketManager.on('streamEnd', () => setInputDisabled(false));

    socketManager.on('tarotCard', () => setInputDisabled(true));

    const requestFeedbackMessage = '이번 상담은 어땠어?\n피드백을 남겨주면 내가 더 발전할 수 있어!';
    const button = { content: '피드백하기', onClick: displayTold };

    socketManager.on('chatEnd', (id: string) => {
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
