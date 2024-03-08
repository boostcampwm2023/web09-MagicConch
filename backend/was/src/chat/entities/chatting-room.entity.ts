import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from '@members/entities';
import { TarotResult } from '@tarot/entities';
import { ChattingMessage } from './chatting-message.entity';

@Entity()
export class ChattingRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30, nullable: true })
  title?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => ChattingMessage, (chattingMessage) => chattingMessage.id)
  chattingMessages?: ChattingMessage[];

  @ManyToOne(() => Member, (member) => member.chattingRooms, { eager: true })
  participant: Member;

  @OneToOne(() => TarotResult, (result) => result.id, { eager: true })
  @JoinColumn()
  result: TarotResult;

  static fromInfo(result: TarotResult, member: Member): ChattingRoom {
    const room = new ChattingRoom();
    room.result = result;
    room.participant = member;
    return room;
  }
}
