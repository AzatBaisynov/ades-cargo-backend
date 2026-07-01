import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '@/dto/user-create.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  public findUserByUsername(user_name: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { user_name } });
  }
  async create(dto: CreateUserDTO) {
    return await this.userRepository.save(dto);
  }
  async delete(user_name: string) {
    return await this.userRepository.delete(user_name);
  }
  async findUserById(user_id: string) {
    return await this.userRepository.findOneBy({ user_id });
  }
}
