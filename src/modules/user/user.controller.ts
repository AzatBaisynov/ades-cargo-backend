import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards, } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/auth.roles.guard';
import { Roles } from '../auth/auth.roles';
import { UpdateUserDTO } from '@/dto/user-update.dto';
import { Request } from 'express';

interface RequestWithUser extends Request { 
  user: {
    id: string;
    username: string;
  };
} 
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getMyInfo(@Req() req: RequestWithUser) {
    return this.userService.findUserById(req.user.id);
  }
   @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('all')
  getAllUsers() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDTO) {
    return this.userService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}



