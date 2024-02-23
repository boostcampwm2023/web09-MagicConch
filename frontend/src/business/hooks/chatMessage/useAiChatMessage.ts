import { useChatMessage } from '.';
import { useEffect, useState } from 'react';

import type { Message, MessageButton } from '@components/common/ChatContainer';

import { useUserFeedback } from '@business/hooks';
import { AISocketManager } from '@business/services/SocketManager';

import { getChatLogQuery } from '@stores/queries';
import { useAiChatLogId } from '@stores/zustandStores';

import { CHAT_MESSAGE } from '@constants/messages';

export function useAiChatMessage() {
  const socketManager = AISocketManager.getInstance();

  const { messages, pushMessage, updateMessage } = useChatMessage();
  const [inputDisabled, setInputDisabled] = useState(true);

  const { displayForm } = useUserFeedback({ type: 'AI' });

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

      addMessage('left', {
        message: CHAT_MESSAGE.ASK_FEEDBACK,
        button: { content: '피드백 남기기', onClick: displayForm },
      });
    });

    return () => socketManager.disconnect();
  }, []);

  const addPickCardMessage = (tarotId: number) => {
    addMessage('left', { tarotId });
  };

  const { id } = useAiChatLogId();
  const { data } = getChatLogQuery(id);

  if (data) {
    const messages =
      data?.map(({ isHost, message }) => {
        const type = isHost ? 'left' : 'right';
        const profile = isHost ? '/moon.png' : '/ddung.png';
        return { type, profile, message };
      }) || [];

    return {
      messages: messages as Message[],
      inputDisabled: true,
      onSubmitMessage: () => {},
      addPickCardMessage: () => {},
    };
  }

  return { messages, inputDisabled, onSubmitMessage, addPickCardMessage };
}
