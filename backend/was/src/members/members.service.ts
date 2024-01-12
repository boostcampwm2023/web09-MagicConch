import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    try {
      const member: Member = Member.fromDto(createMemberDto);
      return await this.membersRepository.save(member);
    } catch (err: unknown) {
      throw err;
    }
  }

  async findByEmail(email: string, providerId: number): Promise<Member | null> {
    return await this.membersRepository.findOneBy({
      email: email,
      providerId: providerId,
    });
  }

  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<boolean> {
    try {
      await this.membersRepository.update({ id }, updateMemberDto);
      return true;
    } catch (err: unknown) {
      throw err;
    }
  }
}
