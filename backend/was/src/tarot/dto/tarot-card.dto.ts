import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { BUCKET_URL, ExtArray } from 'src/common/constants/etc';
import { TarotCard } from '../entities';

export class TarotCardDto {
  @IsUrl()
  @ApiProperty({ description: '타로 카드 이미지 URL', required: true })
  readonly cardUrl: string;

  static fromEntity(entity: TarotCard): TarotCardDto {
    const extStr: string = ExtArray[entity.ext] as string;
    return {
      cardUrl: `${BUCKET_URL}/basic/${entity.cardNo}.${extStr.toLowerCase()}`,
    };
  }
}
