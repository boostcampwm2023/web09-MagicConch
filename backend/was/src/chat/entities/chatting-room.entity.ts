import { Member } from 'src/members/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
  title?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => ChattingMessage, (chattingMessage) => chattingMessage.id)
  chattingMessages?: ChattingMessage[];

  @ManyToOne(() => Member, (member) => member.chattingRooms, { eager: true })
  participant: Member;

  static fromMember(member: Member): ChattingRoom {
    const room = new ChattingRoom();
    room.participant = member;
    return room;
  }
}
