import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';
import { TarotResult } from '../entities';

export class TarotResultDto {
  @IsUrl()
  @ApiProperty({ description: '타로 카드 이미지 URL', required: true })
  readonly cardUrl: string;

  @IsString()
  @ApiProperty({ description: '타로 해설 결과', required: true })
  readonly message: string;

  static fromEntity(entity: TarotResult): TarotResultDto {
    return { ...entity };
  }
}
