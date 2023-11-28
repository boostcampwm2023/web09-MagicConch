import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class TarotCardResponseDto {
  @IsUrl()
  @ApiProperty({ description: '타로 카드 이미지 URL', required: true })
  cardUrl: string;
}
