import { ChattingRoom } from 'src/chat/entities/chatting-room.entity';
import { TarotCard } from 'src/tarot/entities/tarot-card.entity';
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

  @OneToMany(() => TarotCard, (tarotCard) => tarotCard.owner)
  tarotCards: TarotCard[];
}
