import {
  TALK_SYSTEM_MESSAGE,
  TAROTCARD_NAMES,
  TAROTREADING_SYSTEM_MESSAGE,
} from 'src/common/constants/clova-studio';
import { ClovaStudioMessage } from 'src/common/types/clova-studio';

export function createTalkSystemMessage(): ClovaStudioMessage {
  return { role: 'system', content: TALK_SYSTEM_MESSAGE };
}

export function createTarotCardSystemMessage(): ClovaStudioMessage {
  return { role: 'system', content: TAROTREADING_SYSTEM_MESSAGE };
}

export function createUserMessage(userMessage: string): ClovaStudioMessage {
  return { role: 'user', content: userMessage };
}

export function createTarotCardMessage(tarotIdx: number): ClovaStudioMessage {
  return { role: 'user', content: TAROTCARD_NAMES[tarotIdx] };
}
