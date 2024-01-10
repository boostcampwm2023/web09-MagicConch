import { PartialType } from '@nestjs/swagger';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { CreateMemberDto } from './create-member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  static fromProfile(
    providerId: number,
    refreshToken: string,
    profile: ProfileDto,
  ): UpdateMemberDto {
    return {
      email: profile.email,
      providerId: providerId,
      nickname: profile.nickname,
      profileUrl: profile.profileUrl,
      refreshToken: refreshToken,
    };
  }
}
