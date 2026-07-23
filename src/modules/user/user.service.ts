import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '@/dto/user-create.dto';
import { UpdateUserDTO } from '@/dto/user-update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  public findUserByUsername(user_name: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { user_name },
      select: {
        user_id: true,
        user_name: true,
        user_password: true,
        user_email: true,
        fullname: true,
        role: true,
      },
    });
  }
  public findUserByUseremail(user_email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { user_email },
      select: {
        user_id: true,
        user_name: true,
        user_password: true,
        user_email: true,
        fullname: true,
        role: true,
      },
    });
  }
  async create(dto: CreateUserDTO) {
    return await this.userRepository.save(dto);
  }
  async delete(user_id: string) {
    return await this.userRepository.delete(user_id);
  }
  async findUserById(user_id: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { user_id },
      select: {
        user_id: true,
        user_name: true,
        user_email: true,
        fullname: true,
      },
    });
  }
  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      select: {
        user_id: true,
        fullname: true,
        user_name: true,
        user_email: true,
        role: true,
      },
    });
  }

  async update(user_id: string, dto: Partial<UpdateUserDTO>) {
    await this.userRepository.update(user_id, dto);
    return this.findUserById(user_id);
  }
}
