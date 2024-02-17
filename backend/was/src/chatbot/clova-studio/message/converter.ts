import type { ChatLog } from 'src/common/types/chatbot';
import type { ClovaStudioMessage } from 'src/common/types/clova-studio';

export function chatLog2clovaStudioMessages(
  chatLogs: ChatLog[],
): ClovaStudioMessage[] {
  const convertedMessages = chatLogs.reduce((acc, { isHost, message }) => {
    acc.push({
      role: isHost ? 'assistant' : 'user',
      content: message,
    });
    return acc;
  }, [] as ClovaStudioMessage[]);

  return [...convertedMessages];
}
