import { ChattingRoom } from 'src/chat/entities';
import { TarotCardPack } from 'src/tarot/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateMemberDto } from '../dto';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 320, nullable: true })
  email?: string;

  @Column({ type: 'tinyint', nullable: true })
  providerId?: number;

  @Column({ length: 30, nullable: true })
  nickname?: string;

  @Column({ length: 2083, nullable: true })
  profileUrl?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => ChattingRoom, (chattingRoom) => chattingRoom.participant)
  chattingRooms?: ChattingRoom[];

  @OneToMany(() => TarotCardPack, (tarotCardPack) => tarotCardPack.owner)
  tarotCardPacks?: TarotCardPack[];

  static fromDto(createMemberDto: CreateMemberDto): Member {
    const member: Member = new Member();
    member.email = createMemberDto.email;
    member.providerId = createMemberDto.providerId;
    member.nickname = createMemberDto.nickname;
    member.profileUrl = createMemberDto.profileUrl;
    return member;
  }
}
