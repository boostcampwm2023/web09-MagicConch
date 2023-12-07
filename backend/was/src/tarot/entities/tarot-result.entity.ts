import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateTarotResultDto } from '../dto/create-tarot-result.dto';

@Entity()
export class TarotResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  cardUrl: string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static fromDto(dto: CreateTarotResultDto): TarotResult {
    const result: TarotResult = new TarotResult();
    result.cardUrl = dto.cardUrl;
    result.message = dto.message;
    return result;
  }
}
