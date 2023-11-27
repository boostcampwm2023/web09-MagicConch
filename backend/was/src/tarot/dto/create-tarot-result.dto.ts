import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateTarotResultDto {
  /**
   * TODO : 추후 변동 가능성 있음
   */
  @IsUrl()
  @ApiProperty({ description: '타로 카드 URL', required: true })
  cardUrl: string;

  @IsString()
  @ApiProperty({ description: '타로 해설 결과', required: true })
  message: string;
}
