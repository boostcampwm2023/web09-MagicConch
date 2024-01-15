import type { ChatLog } from 'src/common/types/chatbot';

export default interface ChatbotService {
  generateTalk(
    chatLogs: ChatLog[],
    message: string,
  ): Promise<ReadableStream<Uint8Array>>;
  generateTarotReading(
    chatLogs: ChatLog[],
    cardIdx: number,
  ): Promise<ReadableStream<Uint8Array>>;
}
