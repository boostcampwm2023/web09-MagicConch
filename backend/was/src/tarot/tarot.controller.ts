import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  FindTarotCardDecorator,
  FindTarotResultDecorator,
} from 'src/common/decorators/swagger/tarot.decorator';
import { TarotCardResponseDto } from './dto/tarot-card-response.dto';
import { TarotResultResponseDto } from './dto/tarot-result-response.dto';
import { TarotService } from './tarot.service';

@Controller('tarot')
@ApiTags('✅ Tarot API')
export class TarotController {
  constructor(private readonly tarotService: TarotService) {}

  @Get('card/:id')
  @FindTarotCardDecorator(
    '타로 카드 이미지',
    { type: 'integer', name: 'id' },
    TarotCardResponseDto,
  )
  async findTarotCardById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TarotCardResponseDto> {
    return await this.tarotService.findTarotCardById(id);
  }

  @Get('result/:id')
  @FindTarotResultDecorator(
    '타로 결과',
    { type: 'uuid', name: 'id' },
    TarotResultResponseDto,
  )
  async findTarotResultById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TarotResultResponseDto> {
    return await this.tarotService.findTarotResultById(id);
  }
}
