import { PartialType } from '@nestjs/swagger';
import { Member } from '../entities';
import { CreateMemberDto } from './create-member.dto';

export class MemberDto extends PartialType(CreateMemberDto) {
  static fromEntity(entity: Member): MemberDto {
    return {
      nickname: entity.nickname ?? '',
      profileUrl: entity.profileUrl,
    };
  }
}
