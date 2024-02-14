import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ProfileDto } from 'src/auth/dto';
import { ProviderIdEnum } from 'src/common/constants/etc';

export class CreateMemberDto {
  @IsEmail()
  readonly email: string;

  @IsInt()
  @IsIn(Object.values(ProviderIdEnum))
  readonly providerId: number;

  @IsString()
  readonly nickname: string;

  @IsUrl()
  @IsOptional()
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
