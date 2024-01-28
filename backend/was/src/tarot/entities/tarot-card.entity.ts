import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TarotCardPack } from './tarot-card-pack.entity';

@Entity()
export class TarotCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  cardNo: number;

  @Column({ length: 10 })
  ext: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => TarotCardPack, (tarotCardPack) => tarotCardPack.tarotCards)
  cardPack?: TarotCardPack;
}
