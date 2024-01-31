import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateChattingMessageDto } from '../dto';
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
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(
    () => ChattingRoom,
    (chattingRoom) => chattingRoom.chattingMessages,
  )
  room: ChattingRoom;

  static fromDto(
    dto: CreateChattingMessageDto,
    room: ChattingRoom,
  ): ChattingMessage {
    const message: ChattingMessage = new ChattingMessage();
    message.room = room;
    message.isHost = dto.isHost;
    message.message = dto.message;
    return message;
  }
}
