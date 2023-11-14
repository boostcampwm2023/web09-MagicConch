import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TaroResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'binary', length: 32 })
  taroResult: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
