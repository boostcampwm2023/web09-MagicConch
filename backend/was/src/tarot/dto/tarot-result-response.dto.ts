import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class TarotResultResponseDto {
  @IsUrl()
  @ApiProperty({ description: '타로 카드 이미지 URL', required: true })
  cardUrl: string;

  @IsString()
  @ApiProperty({ description: '타로 해설 결과', required: true })
  message: string;
}
