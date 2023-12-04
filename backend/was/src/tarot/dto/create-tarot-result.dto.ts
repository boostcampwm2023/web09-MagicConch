import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';
import { BUCKET_URL } from 'src/common/constants/etc';

export class CreateTarotResultDto {
  /**
   * TODO : 추후 변동 가능성 있음
   */
  @IsUrl()
  @ApiProperty({ description: '타로 카드 URL', required: true })
  readonly cardUrl: string;

  @IsString()
  @ApiProperty({ description: '타로 해설 결과', required: true })
  readonly message: string;

  static fromResult(cardNo: number, message: string): CreateTarotResultDto {
    return {
      cardUrl: `${BUCKET_URL}/basic/${cardNo}.jpg`,
      message: message,
    };
  }
}
