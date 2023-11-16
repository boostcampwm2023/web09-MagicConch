import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTarotResultDto } from './dto/create-tarot-result.dto';
import { TarotCardResponseDto } from './dto/tarot-card-response.dto';
import { TarotResultResponseDto } from './dto/tarot-result-response.dto';
import { TarotCard } from './entities/tarot-card.entity';
import { TarotResult } from './entities/tarot-result.entity';

@Injectable()
export class TarotService {
  constructor(
    @InjectRepository(TarotCard)
    private readonly tarotCardRepository: Repository<TarotCard>,
    @InjectRepository(TarotResult)
    private readonly tarotResultRepository: Repository<TarotResult>,
  ) {}

  /**
   * TODO
   * 추후 Object Storage 도입으로 DTO 변동 가능성 있음
   */
  async createTarotResult(
    createTarotResultDto: CreateTarotResultDto,
  ): Promise<void> {
    const tarotResult: TarotResult = new TarotResult();
    tarotResult.cardUrl = createTarotResultDto.cardUrl;
    tarotResult.message = createTarotResultDto.message;
    try {
      this.tarotResultRepository.save(tarotResult);
    } catch (err: unknown) {
      throw err;
    }
  }

  /**
   * TODO
   * 추후 Object Storage에 접근하는 로직으로 변경
   * 타로 카드팩이 커스텀이 가능한 경우, 전체적인 로직 수정 필요
   */
  async findTarotCardById(id: number): Promise<TarotCardResponseDto> {
    const tarotCard: TarotCard | null =
      await this.tarotCardRepository.findOneBy({
        cardNo: id,
        owner: undefined,
      });
    if (!tarotCard) {
      throw new NotFoundException();
    }
    const cardDto = new TarotCardResponseDto();
    cardDto.cardUrl = tarotCard.cardUrl;
    return cardDto;
  }

  async findTarotResultById(id: string): Promise<TarotResultResponseDto> {
    const tarotResult: TarotResult | null =
      await this.tarotResultRepository.findOneBy({ id });
    if (!tarotResult) {
      throw new NotFoundException();
    }
    const resultDto = new TarotResultResponseDto();
    resultDto.cardUrl = tarotResult.cardUrl;
    resultDto.message = tarotResult.message;
    return resultDto;
  }
}
