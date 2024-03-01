import { AiSocket } from 'socket-event';
import { LoggerService } from '@nestjs/common';
import { string2Uint8ArrayStream } from '@common/utils/stream';
import { ChatService } from '@chat/chat.service';
import { ChatbotService } from '@chatbot/chatbot.interface';
import { TarotService } from '@tarot/tarot.service';

export const aiMessageMock = '인공지능입니다.';
export const humanMessageMock = '사람입니다.';
export const tarotIdxMock = 0;

export const chatServiceMock = {
  createRoom: () => 'room_id',
  createMessages: jest.fn(),
} as unknown as ChatService;

export const tarotServiceMock = {
  createTarotResult: jest.fn(),
} as unknown as TarotService;

export const loggerServiceMock = {
  error: jest.fn(),
} as unknown as LoggerService;

export const chatbotServiceMock = {
  generateTalk: (...argv: any) => string2Uint8ArrayStream(aiMessageMock),
  generateTarotReading: (...argv: any) =>
    string2Uint8ArrayStream(aiMessageMock),
} as unknown as ChatbotService;

export const clientMock = {
  chatLog: [],
  chatEnd: false,
  emit: jest.fn(),
} as unknown as AiSocket;
