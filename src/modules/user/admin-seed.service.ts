import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './user.entity';

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'Admin12345';
const DEFAULT_ADMIN_EMAIL = 'admin@ades.local';
const DEFAULT_ADMIN_FULLNAME = 'Administrator';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    const existingAdmin = await this.userRepository.findOne({
      where: { user_name: DEFAULT_ADMIN_USERNAME },
    });

    if (existingAdmin) {
      this.logger.log('Администратор уже существует, пропускаем создание.');
      return;
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

    await this.userRepository.save({
      fullname: DEFAULT_ADMIN_FULLNAME,
      user_name: DEFAULT_ADMIN_USERNAME,
      user_password: hashedPassword,
      user_email: DEFAULT_ADMIN_EMAIL,
      role: 'admin',
    });

    this.logger.log(
      `Создан администратор по умолчанию: ${DEFAULT_ADMIN_USERNAME} / ${DEFAULT_ADMIN_PASSWORD}`,
    );
  }
}