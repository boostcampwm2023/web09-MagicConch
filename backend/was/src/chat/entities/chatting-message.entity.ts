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

  @Column({ length: 1000, nullable: false })
  message: string;

  @Column({ type: 'tinyint', nullable: false })
  order: number;

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
    order: number,
  ): ChattingMessage {
    const message: ChattingMessage = new ChattingMessage();
    message.room = room;
    message.isHost = dto.isHost;
    message.message = dto.message;
    message.order = order;
    return message;
  }

  static formatResult(result: string): ChattingMessage {
    const message: ChattingMessage = new ChattingMessage();
    message.isHost = true;
    message.message = result;
    return message;
  }
}
