import type { ClovaStudioMessage } from 'src/common/types/clova-studio';
import {
  createTalkSystemMessage,
  createTarotCardMessage,
  createTarotCardSystemMessage,
  createUserMessage,
} from './creator';

export function buildTalkMessages(
  messages: ClovaStudioMessage[],
  userMessage: string,
): ClovaStudioMessage[] {
  return [
    createTalkSystemMessage(),
    ...messages,
    createUserMessage(userMessage),
  ];
}

export function buildTarotReadingMessages(
  messages: ClovaStudioMessage[],
  cardIdx: number,
): ClovaStudioMessage[] {
  return [
    createTalkSystemMessage(),
    ...messages,
    createTarotCardSystemMessage(),
    createTarotCardMessage(cardIdx),
  ];
}
