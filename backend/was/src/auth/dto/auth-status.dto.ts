import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthStatusDto {
  @IsBoolean()
  @ApiProperty({ description: '로그인 여부', required: true })
  isAuthenticated: boolean;
}
