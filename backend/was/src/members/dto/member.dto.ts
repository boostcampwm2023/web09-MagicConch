import { Member } from '../entities';

export class MemberDto {
  static fromEntity(entity: Member): MemberDto {
    return {
      nickname: entity.nickname,
      profileUrl: entity.profileUrl,
    };
  }
}
