import {
  TALK_SYSTEM_MESSAGE,
  TAROTCARD_NAMES,
  TAROTREADING_SYSTEM_MESSAGE,
} from 'src/common/constants/clova-studio';
import { ERR_MSG } from 'src/common/constants/errors';
import { ClovaStudioMessage } from 'src/common/types/clova-studio';

export function createTalkSystemMessage(): ClovaStudioMessage {
  return { role: 'system', content: TALK_SYSTEM_MESSAGE };
}

export function createTarotCardSystemMessage(): ClovaStudioMessage {
  return { role: 'system', content: TAROTREADING_SYSTEM_MESSAGE };
}

export function createUserMessage(userMessage: string): ClovaStudioMessage {
  if (!userMessage.trim()) {
    throw new Error(ERR_MSG.USER_INPUT_EMPTY);
  }
  return { role: 'user', content: userMessage };
}

export function createTarotCardMessage(cardIdx: number): ClovaStudioMessage {
  if (cardIdx < 0 || cardIdx >= TAROTCARD_NAMES.length) {
    throw new Error(ERR_MSG.TAROT_CARD_IDX_OUT_OF_RANGE);
  }
  return { role: 'user', content: TAROTCARD_NAMES[cardIdx] };
}
