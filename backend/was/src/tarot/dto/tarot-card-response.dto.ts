import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { BUCKET_URL } from 'src/common/constants/etc';
import { TarotCard } from '../entities/tarot-card.entity';

export class TarotCardResponseDto {
  @IsUrl()
  @ApiProperty({ description: '타로 카드 이미지 URL', required: true })
  readonly cardUrl: string;

  static fromEntity(entity: TarotCard): TarotCardResponseDto {
    return { cardUrl: `${BUCKET_URL}/basic/${entity.cardNo}${entity.ext}` };
  }
}
