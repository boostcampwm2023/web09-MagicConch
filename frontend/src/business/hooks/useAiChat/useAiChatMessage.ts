import useChatMessage from '../useChatMessage';
import useTOLD from '../useTOLD';
import { useEffect, useState } from 'react';

import type { MessageButton } from '@components/ChatContainer';

import { AISocketManager } from '@business/services/SocketManager';

import { REQUSET_FEEDBACK_MESSAGE } from '@constants/message';
import { TAROT_RESULT_TO_REQUSET_FEEDBACK } from '@constants/time';

export function useAiChatMessage(tarotId: number | undefined, setTarotId: (tarotId: number | undefined) => void) {
  const socketManager = new AISocketManager();

  const { messages, pushMessage, updateMessage } = useChatMessage();
  const [inputDisabled, setInputDisabled] = useState(true);

  const { displayTold } = useTOLD();

  const addMessage = (type: 'left' | 'right', message: string, button?: MessageButton) => {
    const profile = type == 'left' ? '/moon.png' : '/sponge.png';
    pushMessage({ type, message, profile, button });
  };

  const onSubmitMessage = (message: string) => {
    addMessage('right', message);
    socketManager.emit('message', message);
  };

  useEffect(() => {
    socketManager.connect();
  }, []);

  useEffect(() => {
    if (!AISocketManager.socket || AISocketManager.socket.connected) return;

    socketManager.on('streamStart', () => {
      setInputDisabled(true);
      addMessage('left', '');
    });

    socketManager.on('streaming', (text: string) => updateMessage(message => ({ ...message, message: text })));

    socketManager.on('streamEnd', () => setInputDisabled(false));

    socketManager.on('tarotCard', () => setInputDisabled(true));

    socketManager.on('chatEnd', (id: string) => {
      const shareLinkId: string = id;
      updateMessage(message => ({ ...message, shareLinkId }));

      const button = { content: '피드백하기', onClick: displayTold };
      setTimeout(() => addMessage('left', REQUSET_FEEDBACK_MESSAGE, button), TAROT_RESULT_TO_REQUSET_FEEDBACK);
    });
  }, [AISocketManager.socket]);

  useEffect(() => {
    if (tarotId) {
      // TODO: host인지에 따라서 프로필 사진을 다르게 해야함
      pushMessage({ type: 'left', tarotId, profile: '/sponge.png' });
      setTarotId(undefined);
    }
  }, [tarotId]);

  return { messages, inputDisabled, onSubmitMessage };
}
