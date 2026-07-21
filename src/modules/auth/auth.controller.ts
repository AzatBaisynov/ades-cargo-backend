import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '@/dto/user-create.dto';
import { UserLoginDTO } from '@/dto/user-login.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './auth.roles.guard';
import { Roles } from './auth.roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



 @Post('register')
//  @UseGuards(JwtAuthGuard, RolesGuard)
//  @Roles('admin')
public registerUser(@Body() UserCreateDTO: CreateUserDTO) {
  return this.authService.register(UserCreateDTO);
}

  @Post('login')
  public login(@Body() userLoginDTO: UserLoginDTO) {
    return this.authService.login(userLoginDTO);
  }
}
