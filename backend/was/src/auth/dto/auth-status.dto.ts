import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class AuthStatusDto {
  @IsBoolean()
  @ApiProperty({ description: '로그인 여부', required: true })
  isAuthenticated: boolean;
}
