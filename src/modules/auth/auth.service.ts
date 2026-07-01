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
        { message: 'User already exist' },
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
    const existUser = await this.userService.findUserByUsername(
      userLoginDTO.user_name,
    );

    if (!existUser) {
      throw new HttpException(
        { message: "User doesn't exist" },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMatch = await bcrypt.compare(
      userLoginDTO.user_password,
      existUser.user_password,
    );

    if (!isMatch) {
      throw new HttpException(
        { message: 'Wrong password!' },
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = {
      id: existUser.user_id,
      username: userLoginDTO.user_name,
    };

    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }
}
