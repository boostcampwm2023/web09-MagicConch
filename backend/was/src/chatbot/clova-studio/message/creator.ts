import { WsException } from '@nestjs/websockets';
import type { ClovaStudioMessage } from '@common/types/clova-studio';
import {
  TALK_SYSTEM_MESSAGE,
  TAROTCARD_NAMES,
  TAROTREADING_SYSTEM_MESSAGE,
} from '@constants/clova-studio';
import { ERR_MSG } from '@constants/errors';

export function createTalkSystemMessage(): ClovaStudioMessage {
  return { role: 'system', content: TALK_SYSTEM_MESSAGE };
}

export function createTarotCardSystemMessage(): ClovaStudioMessage {
  return { role: 'system', content: TAROTREADING_SYSTEM_MESSAGE };
}

export function createUserMessage(userMessage: string): ClovaStudioMessage {
  if (!userMessage.trim()) {
    throw new WsException(ERR_MSG.USER_CHAT_MESSAGE_INPUT_EMPTY);
  }
  return { role: 'user', content: userMessage };
}

export function createTarotCardMessage(cardIdx: number): ClovaStudioMessage {
  if (cardIdx < 0 || cardIdx >= TAROTCARD_NAMES.length) {
    throw new WsException(ERR_MSG.TAROT_CARD_IDX_OUT_OF_RANGE);
  }
  return { role: 'user', content: TAROTCARD_NAMES[cardIdx] };
}
