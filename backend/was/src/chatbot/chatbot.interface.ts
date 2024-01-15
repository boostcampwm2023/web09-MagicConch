import type { ChatLog } from 'src/common/types/chatbot';

export default interface ChatbotServiceInterface {
  generateTalk(
    chatLog: ChatLog,
    message: string,
  ): Promise<ReadableStream<Uint8Array>>;
  generateTarotReading(
    chatLog: ChatLog,
    cardIdx: number,
  ): Promise<ReadableStream<Uint8Array>>;
}
