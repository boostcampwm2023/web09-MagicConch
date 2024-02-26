import type { ChatLog } from '@common/types/chatbot';

export interface ChatbotService {
  generateTalk(
    chatLogs: ChatLog[],
    message: string,
  ): Promise<ReadableStream<Uint8Array>>;
  generateTarotReading(
    chatLogs: ChatLog[],
    cardIdx: number,
  ): Promise<ReadableStream<Uint8Array>>;
}
