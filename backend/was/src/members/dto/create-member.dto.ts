import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { PROVIDER_ID } from 'src/common/constants/etc';

export class CreateMemberDto {
  @IsEmail()
  readonly email: string;

  @IsInt()
  @IsIn(Object.values(PROVIDER_ID))
  readonly providerId: number;

  @IsString()
  readonly nickname: string;

  @IsUrl()
  @IsOptional()
  readonly profileUrl: string;

  static fromProfile(providerId: number, profile: ProfileDto): CreateMemberDto {
    return {
      email: profile.email,
      providerId: providerId,
      nickname: profile.nickname,
      profileUrl: profile.profileUrl,
    };
  }
}
