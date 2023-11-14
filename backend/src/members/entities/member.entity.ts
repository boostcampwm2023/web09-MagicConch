import { ChattingRoom } from 'src/chat/entities/chatting-room.entity';
import { TaroCard } from 'src/taro/entities/taro-card.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, nullable: true })
  nickname: string;

  @Column({ length: 255, nullable: true })
  profileUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => ChattingRoom, (chattingRoom) => chattingRoom.participant)
  chattingRooms: ChattingRoom[];

  @OneToMany(() => TaroCard, (taroCard) => taroCard.owner)
  taroCards: TaroCard[];
}
