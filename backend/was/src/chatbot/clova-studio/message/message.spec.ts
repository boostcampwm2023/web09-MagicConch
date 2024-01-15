import { TALK_SYSTEM_MESSAGE } from 'src/common/constants/clova-studio';
import { ChatLog } from 'src/common/types/chatbot';
import { ClovaStudioMessage } from 'src/common/types/clova-studio';
import { chatLog2clovaStudioMessages } from './converter';
import { createTarotCardMessage, createUserMessage } from './creator';

describe('[chatbot/clova-studio/message]', () => {
  describe('function chatLog2clovaStudioMessages()', () => {
    it('test (1)', () => {
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

    it('test (2)', () => {
      const input: ChatLog = [];
      const output: ClovaStudioMessage[] = [];

      expect(chatLog2clovaStudioMessages(input)).toEqual(output);
    });
  });

  describe('function createTarotCardMessage()', () => {
    it('test', () => expect(false).toBe(true));
  });

  describe('function createUserMessage()', () => {
    it('test', () => expect(false).toBe(true));
  });

  describe('function buildTalkMessages()', () => {
    it('test', () => expect(false).toBe(true));
  });

  describe('function buildTarotReadingMessages()', () => {
    it('test', () => expect(false).toBe(true));
  });
});
