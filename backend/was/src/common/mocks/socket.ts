import { LoggerService } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { ChatbotService } from 'src/chatbot/chatbot.interface';
import { TarotService } from 'src/tarot/tarot.service';
import { Socket } from '../types/socket';
import { mock_createResponseChunks } from './clova-studio';

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

const tokens = aiMessageMock.split('');
export const chatbotServiceMock = {
  generateTalk: (...argv: any) => mock_createResponseChunks(tokens),
  generateTarotReading: (...argv: any) => mock_createResponseChunks(tokens),
} as unknown as ChatbotService;

export const clientMock = {
  chatLog: [],
  chatEnd: false,
  emit: jest.fn(),
} as unknown as Socket;
