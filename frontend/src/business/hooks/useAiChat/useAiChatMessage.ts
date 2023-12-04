import useChatMessage from '../useChatMessage';
import { useSocket } from '../useSocket';
import useTOLD from '../useTOLD';
import { useEffect, useState } from 'react';

import type { MessageButton } from '@components/ChatContainer';

export function useAiChatMessage(tarotId: number | undefined, setTarotId: (tarotId: number | undefined) => void) {
  const { messages, pushMessage, updateMessage } = useChatMessage();
  const [inputDisabled, setInputDisabled] = useState(true);
  const { socketEmit, socketOn } = useSocket('AIChat');

  const { displayTold } = useTOLD();

  const addMessage = (type: 'left' | 'right', message: string, button?: MessageButton) => {
    const profile = type == 'left' ? '/moon.png' : '/sponge.png';
    pushMessage({ type, message, profile, button });
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
    socketOn('streaming', (text: string) => updateMessage(message => ({ ...message, message: text })));
    socketOn('streamEnd', () => setInputDisabled(false));

    socketOn('tarotCard', () => setInputDisabled(true));

    const requestFeedbackMessage = '이번 상담은 어땠어?\n피드백을 남겨주면 내가 더 발전할 수 있어!';
    const button = { content: '피드백하기', onClick: displayTold };

    socketOn('chatEnd', (id: string) => {
      const shareLinkId: string = id;
      updateMessage(message => ({ ...message, shareLinkId }));
      setTimeout(() => addMessage('left', requestFeedbackMessage, button), 5000);
    });
  }, []);

  useEffect(() => {
    if (tarotId) {
      // TODO: host인지에 따라서 프로필 사진을 다르게 해야함
      pushMessage({ type: 'left', tarotId, profile: '/sponge.png' });
      setTarotId(undefined);
    }
  }, [tarotId]);

  return { messages, inputDisabled, onSubmitMessage };
}
