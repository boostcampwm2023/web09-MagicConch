import { Member } from 'src/members/entities/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TarotCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  cardNo: number;

  /**
   * TODO : 추후 개선 사항
   * cardPack은 사용자가 지정한 타로 카드팩 이름
   */
  @Column({ length: 20 })
  cardPack: string;

  @Column({ length: 255 })
  cardUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Member, (member) => member.tarotCards)
  owner: Member;
}
