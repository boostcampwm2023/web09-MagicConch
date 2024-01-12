import { ChatLog } from 'src/common/types/chatbot';

export default interface ChatbotServiceInterface {
  createTalk(
    chatLog: ChatLog,
    message: string,
  ): Promise<ReadableStream<Uint8Array>>;
  createTarotReading(
    chatLog: ChatLog,
    cardIdx: number,
  ): Promise<ReadableStream<Uint8Array>>;
}
