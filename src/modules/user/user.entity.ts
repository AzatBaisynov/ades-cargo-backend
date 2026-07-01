import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;
  @Column()
  fullname!: string;
  @Column()
  user_name!: string;
  @Column()
  user_password!: string;
  @Column()
  user_email!: string;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updateAt!: Date;
}
