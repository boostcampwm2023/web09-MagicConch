import {
  TALK_SYSTEM_MESSAGE,
  TAROTCARD_NAMES,
  TAROTREADING_SYSTEM_MESSAGE,
} from 'src/common/constants/clova-studio';
import type { ChatLog } from 'src/common/types/chatbot';
import type { ClovaStudioMessage } from 'src/common/types/clova-studio';
import { buildTalkMessages, buildTarotReadingMessages } from './builder';
import { chatLog2clovaStudioMessages } from './converter';
import { createTarotCardMessage, createUserMessage } from './creator';

describe('[chatbot/clova-studio/message]', () => {
  describe('function chatLog2clovaStudioMessages()', () => {
    it('ChatLog 타입의 채팅 기록을 ClovaStudioMessage 타입의 채팅 기록으로 전환', () => {
      const input: ChatLog[] = [
        { isHost: true, message: 'host message' },
        { isHost: false, message: 'user message' },
      ];
      const output: ClovaStudioMessage[] = [
        { role: 'assistant', content: 'host message' },
        { role: 'user', content: 'user message' },
      ];

      expect(chatLog2clovaStudioMessages(input)).toEqual(output);
    });

    it('입력이 빈 배열일 때, 그대로 빈 배열이 출력', () => {
      const input: ChatLog[] = [];
      const output: ClovaStudioMessage[] = [];

      expect(chatLog2clovaStudioMessages(input)).toEqual(output);
    });
  });

  describe('function createUserMessage()', () => {
    it('사용자 채팅 기록을 ClovaStudioMessage 타입으로 반환', () => {
      const output: ClovaStudioMessage = {
        role: 'user',
        content: 'user message',
      };
      expect(createUserMessage('user message')).toEqual(output);
    });
    it('입력이 빈 값이면, 오류 발생', () => {
      expect(() => createUserMessage('')).toThrow();
      expect(() => createUserMessage(' ')).toThrow();
    });
  });

  describe('function createTarotCardMessage()', () => {
    it('유저가 타로 카드를 뽑은 기록을 ClovaStudioMessage 타입으로 반환', () => {
      const output: ClovaStudioMessage = {
        role: 'user',
        content: TAROTCARD_NAMES[21],
      };

      expect(createTarotCardMessage(21)).toEqual(output);
    });
    it('입력이 범위에서 벗어난 값일 경우, 오류 발생', () => {
      expect(() => createTarotCardMessage(-1)).toThrow();
      expect(() => createTarotCardMessage(79)).toThrow();
    });
  });

  describe('function buildTalkMessages()', () => {
    it('일반 채팅을 위한 시스템 메세지와 유저 메세지를 추가한 ClovaStudioMessage 형식의 채팅 기록 반환', () => {
      const input: ClovaStudioMessage[] = [
        { role: 'assistant', content: 'assistant message 1' },
        { role: 'user', content: 'user message 1' },
        { role: 'assistant', content: 'assistant message 2' },
      ];
      const output: ClovaStudioMessage[] = [
        { role: 'system', content: TALK_SYSTEM_MESSAGE },
        { role: 'assistant', content: 'assistant message 1' },
        { role: 'user', content: 'user message 1' },
        { role: 'assistant', content: 'assistant message 2' },
        { role: 'user', content: 'user message 2' },
      ];

      expect(buildTalkMessages(input, 'user message 2')).toEqual(output);
    });

    it('입력이 빈 배열인 경우, 시스템 메세지와 추가된 유저 메세지만 반환', () => {
      const input: ClovaStudioMessage[] = [];
      const output: ClovaStudioMessage[] = [
        { role: 'system', content: TALK_SYSTEM_MESSAGE },
        { role: 'user', content: 'user message' },
      ];

      expect(buildTalkMessages(input, 'user message')).toEqual(output);
    });
  });

  describe('function buildTarotReadingMessages()', () => {
    it('타로 카드 해설을 위한 시스템 메세지와 타로 카드 뽑은 기록을 추가한 ClovaStudioMessage 형식의 채팅 기록 반환', () => {
      const input: ClovaStudioMessage[] = [
        { role: 'assistant', content: 'assistant message 1' },
        { role: 'user', content: 'user message 1' },
        { role: 'assistant', content: 'assistant message 2' },
      ];
      const output: ClovaStudioMessage[] = [
        { role: 'system', content: TALK_SYSTEM_MESSAGE },
        { role: 'assistant', content: 'assistant message 1' },
        { role: 'user', content: 'user message 1' },
        { role: 'assistant', content: 'assistant message 2' },
        { role: 'system', content: TAROTREADING_SYSTEM_MESSAGE },
        { role: 'user', content: TAROTCARD_NAMES[21] },
      ];

      expect(buildTarotReadingMessages(input, 21)).toEqual(output);
    });
    it('타로 카드 index 입력이 범위에서 벗어난 값일 때, 오류 발생', () => {
      expect(() => buildTarotReadingMessages([], -1)).toThrow();
      expect(() => buildTarotReadingMessages([], 79)).toThrow();
    });
  });
});
