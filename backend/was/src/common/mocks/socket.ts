import { LoggerService } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { ChatbotService } from 'src/chatbot/chatbot.interface';
import { TarotService } from 'src/tarot/tarot.service';
import { Socket } from '../types/socket';
import { string2Uint8ArrayStream } from '../utils/stream';

export const aiMessageMock = '인공지능입니다.';
export const humanMessageMock = '사람입니다.';

export const chatServiceMock = {
  createRoom: jest.fn(),
  createMessage: jest.fn(),
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
} as unknown as Socket;
