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
  @Column({ unique: true })
  user_name!: string;
  @Column({ select: false })
  user_password!: string;
  @Column({ unique: true })
  user_email!: string;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updateAt!: Date;
}
