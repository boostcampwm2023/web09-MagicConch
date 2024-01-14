import { TAROTCARD_NAMES } from 'src/common/constants/clova-studio';
import { ClovaStudioMessage } from 'src/common/types/clova-studio';

export function createUserMessage(userMessage: string): ClovaStudioMessage {
  return { role: 'user', content: userMessage };
}

export function createTarotCardMessage(tarotIdx: number): ClovaStudioMessage {
  return { role: 'user', content: TAROTCARD_NAMES[tarotIdx] };
}
