import { TarotResult } from 'src/tarot/entities';

function makeTarotResultMock(id: string, message: string): TarotResult {
  const tarotResult: TarotResult = new TarotResult();
  tarotResult.id = id;
  tarotResult.message = message;
  return tarotResult;
}

export const resultId: string = '12345678-1234-5678-1234-567812345678';

export const invalidResultId: string = '12345678-1234-5678-1234-567812345679';

export const tarotResultMessage: string = 'tarotResultMessage';

export const tarotResultMock: TarotResult = makeTarotResultMock(
  resultId,
  tarotResultMessage,
);
