import { Member } from 'src/members/entities/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TarotCard } from './tarot-card.entity';

/**
 * TODO : 추후 개선 사항
 * 사용자별 카드 위치 : objectUrl/memberId/cardPackId/cardNo
 */
@Entity()
export class TarotCardPack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  cardPackName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Member, (member) => member.tarotCardPacks)
  owner: Member;

  @OneToMany(() => TarotCard, (tarotCard) => tarotCard.cardPack)
  tarotCards: TarotCard[];
}
