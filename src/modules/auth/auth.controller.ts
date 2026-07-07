import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '@/dto/user-create.dto';
import { UserLoginDTO } from '@/dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public registerUser(@Body() UserCreateDTO: CreateUserDTO) {
    return this.authService.register(UserCreateDTO);
  }

  @Post('login')
  public login(@Body() userLoginDTO: UserLoginDTO) {
    return this.authService.login(userLoginDTO);
  }
}
