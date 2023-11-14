import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChattingRoom } from './chatting-room.entity';

@Entity()
export class ChattingMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean')
  isHost: boolean;

  @Column({ length: 1000 })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => ChattingRoom,
    (chattingRoom) => chattingRoom.chattingMessages,
  )
  roomId: ChattingRoom;
}
