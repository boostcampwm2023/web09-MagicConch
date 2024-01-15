import { TALK_SYSTEM_MESSAGE } from 'src/common/constants/clova-studio';
import { ChatLog } from 'src/common/types/chatbot';
import { ClovaStudioMessage } from 'src/common/types/clova-studio';
import { createTalkSystemMessage } from './creator';

export function chatLog2clovaStudioMessages(
  chatLog: ChatLog,
): ClovaStudioMessage[] {
  const convertedMessages = chatLog.reduce((acc, { isHost, message }) => {
    acc.push({
      role: isHost ? 'assistant' : 'user',
      content: message,
    });
    return acc;
  }, [] as ClovaStudioMessage[]);

  return [...convertedMessages];
}

export function clovaStudioMessages2chatLog(
  messages: ClovaStudioMessage[],
): ChatLog {
  return messages
    .filter(({ role }) => role != 'system')
    .reduce((acc, { role, content }) => {
      acc.push({
        isHost: role === 'assistant',
        message: content,
      });
      return acc;
    }, [] as ChatLog);
}
