import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TarotCardResponseDto } from './dto/tarot-card-response.dto';
import { TarotResultResponseDto } from './dto/tarot-result-response.dto';
import { TarotService } from './tarot.service';

@Controller('tarot')
@ApiTags('✅ Tarot API')
export class TarotController {
  constructor(private readonly tarotService: TarotService) {}

  @Get('card/:id')
  @ApiOperation({ summary: '타로 카드 이미지 URL 조회 API' })
  @ApiParam({ type: 'integer', name: 'id' })
  @ApiOkResponse({
    description: '타로 카드 이미지 URL 조회 성공',
    type: TarotCardResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 카드' })
  @ApiInternalServerErrorResponse()
  async findTarotCardById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TarotCardResponseDto> {
    return await this.tarotService.findTarotCardById(id);
  }

  @Get('result/:id')
  @ApiOperation({ summary: '타로 결과 조회 API' })
  @ApiParam({ type: 'uuid', name: 'id' })
  @ApiOkResponse({
    description: '타로 결과 조회 성공',
    type: TarotResultResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 타로 결과' })
  @ApiInternalServerErrorResponse()
  async findTarotResultById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TarotResultResponseDto> {
    return await this.tarotService.findTarotResultById(id);
  }
}
