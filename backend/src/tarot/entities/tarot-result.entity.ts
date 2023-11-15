import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TarotResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'binary', length: 32 })
  tarotResult: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
