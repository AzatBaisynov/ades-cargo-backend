import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('acceptance')
export class Acceptance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customer_code!: string;

  @Column()
  product_code!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  weight_Kg!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
