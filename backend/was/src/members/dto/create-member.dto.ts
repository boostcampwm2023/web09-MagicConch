import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderIdEnum } from '@constants/etc';
import { ProfileDto } from '@auth/dto';

export class CreateMemberDto {
  @IsEmail()
  readonly email: string;

  @IsInt()
  @IsIn(Object.values(ProviderIdEnum))
  readonly providerId: number;

  @IsString()
  @ApiProperty({
    description: '사용자 닉네임',
    required: true,
  })
  readonly nickname: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    description: '사용자 프로필 URL',
    required: false,
  })
  readonly profileUrl?: string;

  static fromProfile(providerId: number, profile: ProfileDto): CreateMemberDto {
    return {
      email: profile.email,
      providerId: providerId,
      nickname: profile.nickname,
      profileUrl: profile.profileUrl,
    };
  }
}
