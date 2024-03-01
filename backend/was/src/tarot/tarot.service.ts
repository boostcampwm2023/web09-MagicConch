import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TAROT_CODEMAP } from '@exceptions/codemap';
import { CustomException } from '@exceptions/custom-exception';
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
  ): Promise<TarotResult> {
    const tarotResult: TarotResult = TarotResult.fromDto(createTarotResultDto);
    try {
      return await this.tarotResultRepository.save(tarotResult);
    } catch (err: unknown) {
      throw err;
    }
  }

  /**
   * TODO : 추후 타로 카드팩이 커스텀이 가능한 경우, 전체적인 로직 수정 필요
   */
  async findTarotCardByCardNo(cardNo: number): Promise<TarotCardDto> {
    try {
      const tarotCard: TarotCard | null =
        await this.tarotCardRepository.findOne({
          where: {
            cardNo: cardNo,
            cardPack: undefined,
          },
          select: ['cardNo', 'ext', 'cardPack'],
        });

      if (!tarotCard) {
        throw new CustomException(TAROT_CODEMAP.CARD_NOT_FOUND);
      }
      return TarotCardDto.fromEntity(tarotCard);
    } catch (err: unknown) {
      throw err;
    }
  }

  async findTarotResultById(id: string): Promise<TarotResultDto> {
    try {
      const tarotResult: TarotResult | null =
        await this.tarotResultRepository.findOne({
          where: { id: id },
          select: ['cardUrl', 'message'],
        });
      if (!tarotResult) {
        throw new CustomException(TAROT_CODEMAP.RESULT_NOT_FOUND);
      }
      return TarotResultDto.fromEntity(tarotResult);
    } catch (err: unknown) {
      throw err;
    }
  }
}
