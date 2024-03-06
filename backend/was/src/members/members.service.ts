import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MEMBERS_CODEMAP } from '@exceptions/codemap/members-codemap';
import { CustomException } from '@exceptions/custom-exception';
import { MemberDto } from './dto/member.dto';
import { Member } from './entities';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async findMemberByEmail(
    email: string,
    providerId: number,
  ): Promise<MemberDto> {
    const member: Member | null = await this.membersRepository.findOne({
      where: { email, providerId },
      select: ['nickname', 'profileUrl'],
    });
    if (!member) {
      throw new CustomException(MEMBERS_CODEMAP.NOT_FOUND);
    }
    return MemberDto.fromEntity(member);
  }
}
