import { ChattingRoom } from 'src/chat/entities/chatting-room.entity';
import { TarotCardPack } from 'src/tarot/entities/tarot-card-pack.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateMemberDto } from '../dto/create-member.dto';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 320 })
  email: string;

  @Column()
  providerId: number;

  @Column({ length: 30 })
  nickname: string;

  @Column({ length: 2083, nullable: true })
  profileUrl: string;

  @Column({ type: 'text' })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => ChattingRoom, (chattingRoom) => chattingRoom.participant)
  chattingRooms: ChattingRoom[];

  @OneToMany(() => TarotCardPack, (tarotCardPack) => tarotCardPack.owner)
  tarotCardPacks: TarotCardPack[];

  static fromDto(createMemberDto: CreateMemberDto): Member {
    const member: Member = new Member();
    member.email = createMemberDto.email;
    member.providerId = createMemberDto.providerId;
    member.nickname = createMemberDto.nickname;
    member.profileUrl = createMemberDto.profileUrl;
    return member;
  }
}
