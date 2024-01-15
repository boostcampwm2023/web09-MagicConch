import {
  TALK_SYSTEM_MESSAGE,
  TAROTCARD_NAMES,
  TAROTREADING_SYSTEM_MESSAGE,
} from 'src/common/constants/clova-studio';
import { ChatLog } from 'src/common/types/chatbot';
import { ClovaStudioMessage } from 'src/common/types/clova-studio';
import { buildTalkMessages, buildTarotReadingMessages } from './builder';
import { chatLog2clovaStudioMessages } from './converter';
import { createTarotCardMessage, createUserMessage } from './creator';

describe('[chatbot/clova-studio/message]', () => {
  describe('function chatLog2clovaStudioMessages()', () => {
    it('test (1): 기본 실행 테스트', () => {
      const input: ChatLog = [
        { isHost: true, message: 'host message' },
        { isHost: false, message: 'user message' },
      ];
      const output: ClovaStudioMessage[] = [
        { role: 'assistant', content: 'host message' },
        { role: 'user', content: 'user message' },
      ];

      expect(chatLog2clovaStudioMessages(input)).toEqual(output);
    });

    it('test (2): 입력이 빈 배열일 때', () => {
      const input: ChatLog = [];
      const output: ClovaStudioMessage[] = [];

      expect(chatLog2clovaStudioMessages(input)).toEqual(output);
    });
  });

  describe('function createUserMessage()', () => {
    it('test (1): 기본 실행 테스트', () => {
      const output: ClovaStudioMessage = {
        role: 'user',
        content: 'user message',
      };
      expect(createUserMessage('user message')).toEqual(output);
    });
    it('test (2): 입력이 빈 값일 때', () => {
      expect(() => createUserMessage('')).toThrow();
      expect(() => createUserMessage(' ')).toThrow();
    });
  });

  describe('function createTarotCardMessage()', () => {
    it('test (1): 기본 실행 테스트', () => {
      const output: ClovaStudioMessage = {
        role: 'user',
        content: TAROTCARD_NAMES[21],
      };

      expect(createTarotCardMessage(21)).toEqual(output);
    });
    it('test (2): 입력이 범위에서 벗어난 값일 때', () => {
      expect(() => createTarotCardMessage(-1)).toThrow();
      expect(() => createTarotCardMessage(79)).toThrow();
    });
  });

  describe('function buildTalkMessages()', () => {
    it('test (1): 기본 실행 테스트', () => {
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

    it('test (2): 입력이 빈 값일 때', () => {
      const input: ClovaStudioMessage[] = [];
      const output: ClovaStudioMessage[] = [
        { role: 'system', content: TALK_SYSTEM_MESSAGE },
        { role: 'user', content: 'user message' },
      ];

      expect(buildTalkMessages(input, 'user message')).toEqual(output);
    });
  });

  describe('function buildTarotReadingMessages()', () => {
    it('test (1): 기본 실행 테스트', () => {
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
    it('test (2): 입력이 범위에서 벗어난 값일 때', () => {
      expect(() => buildTarotReadingMessages([], -1)).toThrow();
      expect(() => buildTarotReadingMessages([], 79)).toThrow();
    });
  });
});
