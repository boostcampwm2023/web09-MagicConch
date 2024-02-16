import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateTarotResultDto } from '../dto';

@Entity()
export class TarotResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  cardUrl: string;

  @Column({ length: 1000 })
  message: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  static fromDto(dto: CreateTarotResultDto): TarotResult {
    const result: TarotResult = new TarotResult();
    result.cardUrl = dto.cardUrl;
    result.message = dto.message;
    return result;
  }
}
