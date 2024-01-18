import { TarotResult } from 'src/tarot/entities';

function makeTarotResultMock(id: string, message: string): TarotResult {
  const tarotResult: TarotResult = new TarotResult();
  tarotResult.id = id;
  tarotResult.message = message;
  return tarotResult;
}

export const tarotResultId: string = 'tarotResultId';

export const tarotResultMessage: string = 'tarotResultMessage';

export const tarotResultMock: TarotResult = makeTarotResultMock(
  tarotResultId,
  tarotResultMessage,
);
