import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('price')
export class PriceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column('decimal', { precision: 10, scale: 2 })
  current_price!: number;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
