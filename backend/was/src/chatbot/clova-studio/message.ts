import {
  TALK_SYSTEM_MESSAGE,
  TAROTCARD_NAMES,
} from 'src/common/constants/clova-studio';
import { ChatLog } from 'src/common/types/chatbot';
import { ClovaStudioMessage } from 'src/common/types/clova-studio';

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

  const systemMessage: ClovaStudioMessage = {
    role: 'system',
    content: TALK_SYSTEM_MESSAGE,
  };

  return [systemMessage, ...convertedMessages];
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

export function createUserMessage(userMessage: string): ClovaStudioMessage {
  return { role: 'user', content: userMessage };
}

export function createTarotCardMessage(tarotIdx: number): ClovaStudioMessage {
  return { role: 'user', content: TAROTCARD_NAMES[tarotIdx] };
}
