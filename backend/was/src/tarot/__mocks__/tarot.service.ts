import { NotFoundException } from '@nestjs/common';
import { TarotCardDto, TarotResultDto } from '../dto';
import { resultId } from './tarot-result';

export class TarotService {
  findTarotCardByCardNo = jest
    .fn()
    .mockImplementation((cardNo: number): TarotCardDto => {
      if (cardNo >= 0 && cardNo <= 78) {
        return { cardUrl: 'cardUrl' };
      }
      throw new NotFoundException();
    });

  findTarotResultById = jest
    .fn()
    .mockImplementation((id: string): TarotResultDto => {
      if (id === resultId) {
        return {
          cardUrl: 'cardUrl',
          message: 'message',
        };
      }
      throw new NotFoundException();
    });
}
