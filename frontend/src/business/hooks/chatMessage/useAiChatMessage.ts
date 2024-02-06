import { useChatMessage } from '.';
import { useEffect, useState } from 'react';

import { MessageButton } from '@components/common/ChatContainer';

import { AISocketManager } from '@business/services/SocketManager';

export function useAiChatMessage() {
  const socketManager = AISocketManager.getInstance();

  const { messages, pushMessage, updateMessage } = useChatMessage();
  const [inputDisabled, setInputDisabled] = useState(true);

  const addMessage = (
    type: 'left' | 'right',
    options: { message?: string; tarotId?: number; button?: MessageButton },
  ) => {
    const profile = type === 'left' ? '/moon.png' : '/ddung.png';
    pushMessage(type, profile, options);
  };

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

    socketManager.on('chatEnd', (id: string) => {
      setInputDisabled(true);

      const shareLinkId: string = id;
      updateMessage(message => ({ ...message, shareLinkId }));
    });

    return () => socketManager.disconnect();
  }, []);

  const addPickCardMessage = (tarotId: number) => {
    addMessage('left', { tarotId });
  };

  return { messages, inputDisabled, onSubmitMessage, addPickCardMessage };
}
