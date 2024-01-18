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

  @Get('card/:id')
  @FindTarotCardDecorator(
    '타로 카드 이미지',
    { type: 'integer', name: 'id' },
    TarotCardDto,
  )
  async findTarotCardById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TarotCardDto> {
    return await this.tarotService.findTarotCardById(id);
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
