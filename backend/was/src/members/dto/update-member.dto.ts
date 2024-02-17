import { PartialType } from '@nestjs/swagger';
import { ProfileDto } from 'src/auth/dto';
import { CreateMemberDto } from './create-member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  static fromProfile(providerId: number, profile: ProfileDto): UpdateMemberDto {
    return {
      email: profile.email,
      providerId: providerId,
      nickname: profile.nickname,
      profileUrl: profile.profileUrl,
    };
  }
}
