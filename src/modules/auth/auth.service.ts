import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '@/dto/user-create.dto';
import { UserLoginDTO } from '@/dto/user-login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(userCreateDTO: CreateUserDTO) {
    const existUser = await this.userService.findUserByUsername(
      userCreateDTO.user_name,
    );

    if (existUser) {
      throw new HttpException(
        {
          message: `Пользователь с именем ${userCreateDTO.user_name} уже существует`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const existEmail = await this.userService.findUserByUseremail(
      userCreateDTO.user_email,
    );
    if (existEmail) {
      throw new HttpException(
        {
          message: `Эта почта ${userCreateDTO.user_email} уже существует`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(userCreateDTO.user_password, 10);

    const user = await this.userService.create({
      ...userCreateDTO,
      user_password: hashedPassword,
    });

    return user;
  }

  public async login(userLoginDTO: UserLoginDTO) {
    let existUser = await this.userService.findUserByUsername(
      userLoginDTO.user_name,
    );
    if (!existUser) {
      existUser = await this.userService.findUserByUseremail(
        userLoginDTO.user_name,
      );
    }

    if (!existUser) {
      throw new HttpException(
        { message: 'Пользователь не существует' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMatch = await bcrypt.compare(
      userLoginDTO.user_password,
      existUser.user_password,
    );

    if (!isMatch) {
      throw new HttpException(
        { message: 'Неправильный пароль!' },
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = {
      id: existUser.user_id,
      username: existUser.user_name,
      role: existUser.role,
    };

    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
      user: {
        id: existUser.user_id,
        fullname: existUser.fullname,
        user_email: existUser.user_email,
        user_name: existUser.user_name,
      },
    };
  }
}
