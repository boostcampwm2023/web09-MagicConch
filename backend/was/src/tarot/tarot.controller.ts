import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TarotCardDto, TarotResultDto } from './dto';
import {
  FindTarotCardDecorator,
  FindTarotResultDecorator,
} from './tarot.decorators';
import { TarotService } from './tarot.service';

@Controller('tarot')
@ApiTags('✅ Tarot API')
export class TarotController {
  constructor(private readonly tarotService: TarotService) {}

  @Get('card/:cardNo')
  @FindTarotCardDecorator(
    '타로 카드 이미지',
    { type: 'integer', name: 'cardNo' },
    TarotCardDto,
  )
  async findTarotCardByCardNo(
    @Param('cardNo', ParseIntPipe) cardNo: number,
  ): Promise<TarotCardDto> {
    return await this.tarotService.findTarotCardByCardNo(cardNo);
  }

  @Get('result/:id')
  @FindTarotResultDecorator(
    '타로 결과',
    { type: 'uuid', name: 'id' },
    TarotResultDto,
  )
  async findTarotResultById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TarotResultDto> {
    return await this.tarotService.findTarotResultById(id);
  }
}
