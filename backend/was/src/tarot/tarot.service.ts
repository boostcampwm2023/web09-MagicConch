import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERR_MSG } from 'src/common/constants/errors';
import { LoggerService } from 'src/logger/logger.service';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateTarotResultDto } from './dto/create-tarot-result.dto';
import { TarotCardResponseDto } from './dto/tarot-card-response.dto';
import { TarotResultResponseDto } from './dto/tarot-result-response.dto';
import { TarotCard } from './entities/tarot-card.entity';
import { TarotResult } from './entities/tarot-result.entity';

const bucketUrl = 'https://kr.object.ncloudstorage.com/magicconch';

@Injectable()
export class TarotService {
  constructor(
    @InjectRepository(TarotCard)
    private readonly tarotCardRepository: Repository<TarotCard>,
    @InjectRepository(TarotResult)
    private readonly tarotResultRepository: Repository<TarotResult>,
    private readonly logger: LoggerService,
  ) {}

  async createTarotResult(
    createTarotResultDto: CreateTarotResultDto,
  ): Promise<string> {
    const tarotResult: TarotResult = new TarotResult();
    tarotResult.cardUrl = createTarotResultDto.cardUrl;
    tarotResult.message = createTarotResultDto.message;
    try {
      const savedResult: TarotResult =
        await this.tarotResultRepository.save(tarotResult);
      return savedResult.id;
    } catch (err: unknown) {
      if (err instanceof QueryFailedError) {
        this.logger.error(
          `Failed to create tarot result : ${err.message}`,
          err.stack,
        );
        if (err.message.includes('UNIQUE')) {
          throw new Error(ERR_MSG.NOT_UNIQUE);
        }
        throw new Error(ERR_MSG.UNKNOWN_DATABASE);
      }
      throw new Error(ERR_MSG.UNKNOWN);
    }
  }

  /**
   * TODO : 추후 타로 카드팩이 커스텀이 가능한 경우, 전체적인 로직 수정 필요
   */
  async findTarotCardById(id: number): Promise<TarotCardResponseDto> {
    const tarotCard: TarotCard | null =
      await this.tarotCardRepository.findOneBy({
        cardNo: id,
        cardPack: undefined,
      });
    if (!tarotCard) {
      this.logger.error(
        `Failed to find tarot card : ${ERR_MSG.TAROT_CARD_NOT_FOUND}`,
      );
      throw new NotFoundException(ERR_MSG.TAROT_CARD_NOT_FOUND);
    }
    const cardDto = new TarotCardResponseDto();
    const url: string = `${bucketUrl}/basic/${id}${tarotCard.ext}`;
    cardDto.cardUrl = url;
    return cardDto;
  }

  async findTarotResultById(id: string): Promise<TarotResultResponseDto> {
    const tarotResult: TarotResult | null =
      await this.tarotResultRepository.findOneBy({ id });
    if (!tarotResult) {
      this.logger.error(
        `Failed to find tarot result : ${ERR_MSG.TAROT_RESULT_NOT_FOUND}`,
      );
      throw new NotFoundException(ERR_MSG.TAROT_RESULT_NOT_FOUND);
    }
    const resultDto = new TarotResultResponseDto();
    resultDto.cardUrl = tarotResult.cardUrl;
    resultDto.message = tarotResult.message;
    return resultDto;
  }
}
