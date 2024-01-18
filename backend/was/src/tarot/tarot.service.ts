import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERR_MSG } from 'src/common/constants/errors';
import { Repository } from 'typeorm';
import { CreateTarotResultDto, TarotCardDto, TarotResultDto } from './dto';
import { TarotCard, TarotResult } from './entities';

@Injectable()
export class TarotService {
  constructor(
    @InjectRepository(TarotCard)
    private readonly tarotCardRepository: Repository<TarotCard>,
    @InjectRepository(TarotResult)
    private readonly tarotResultRepository: Repository<TarotResult>,
  ) {}

  async createTarotResult(
    createTarotResultDto: CreateTarotResultDto,
  ): Promise<string> {
    const tarotResult: TarotResult = TarotResult.fromDto(createTarotResultDto);
    try {
      const savedResult: TarotResult =
        await this.tarotResultRepository.save(tarotResult);
      return savedResult.id;
    } catch (err: unknown) {
      throw err;
    }
  }

  /**
   * TODO : 추후 타로 카드팩이 커스텀이 가능한 경우, 전체적인 로직 수정 필요
   */
  async findTarotCardById(id: number): Promise<TarotCardDto> {
    const tarotCard: TarotCard | null =
      await this.tarotCardRepository.findOneBy({
        cardNo: id,
        cardPack: undefined,
      });
    if (!tarotCard) {
      throw new NotFoundException(ERR_MSG.TAROT_CARD_NOT_FOUND);
    }
    return TarotCardDto.fromEntity(tarotCard);
  }

  async findTarotResultById(id: string): Promise<TarotResultDto> {
    const tarotResult: TarotResult | null =
      await this.tarotResultRepository.findOneBy({ id });
    if (!tarotResult) {
      throw new NotFoundException(ERR_MSG.TAROT_RESULT_NOT_FOUND);
    }
    return TarotResultDto.fromEntity(tarotResult);
  }
}
