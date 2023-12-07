import { Member } from 'src/members/entities/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChattingMessage } from './chatting-message.entity';

@Entity()
export class ChattingRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => ChattingMessage, (chattingMessage) => chattingMessage.id)
  chattingMessages: ChattingMessage[];

  @ManyToOne(() => Member, (member) => member.chattingRooms)
  participant: Member;

  static fromMember(member: Member): ChattingRoom {
    const room = new ChattingRoom();
    room.participant = member;
    return room;
  }
}
