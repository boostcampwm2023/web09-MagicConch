import useChatMessage from '../useChatMessage';
import { useSocket } from '../useSocket';
import { useEffect, useState } from 'react';

export function useAiChatMessage(tarotCardId: React.MutableRefObject<number | undefined>) {
  const { messages, addMessage, updateMessage } = useChatMessage(tarotCardId);
  const [inputDisabled, setInputDisabled] = useState(false);
  const { socketEmit, socketOn } = useSocket('AIChat');

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
    const button = { content: '피드백하기', onClick: () => {} };

    socketOn('chatEnd', (id: string) => {
      const shareLinkId: string = id;
      updateMessage(message => ({ ...message, shareLinkId }));
      setTimeout(() => addMessage('left', requestFeedbackMessage, button), 5000);
    });
  }, []);

  return { messages, inputDisabled, onSubmitMessage };
}
