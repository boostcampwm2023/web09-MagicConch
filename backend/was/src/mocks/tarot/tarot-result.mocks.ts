import { TarotResult } from 'src/tarot/entities';
import { v4 as uuidv4 } from 'uuid';

function makeTarotResultMock(id: string, message: string): TarotResult {
  const tarotResult: TarotResult = new TarotResult();
  tarotResult.id = tarotResultId;
  tarotResult.message = tarotResultMessage;
  return tarotResult;
}

export const tarotResultId = uuidv4();
export const tarotResultMessage = 'tarot result message';

export const tarotResultMock: TarotResult = makeTarotResultMock(
  tarotResultId,
  tarotResultMessage,
);
