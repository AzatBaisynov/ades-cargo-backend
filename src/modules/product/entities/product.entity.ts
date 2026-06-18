import { ProductStatus } from '@/enums/product-status.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  customer_code!: string;

  @Column()
  product_code!: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PENDING,
  })
  status!: ProductStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
