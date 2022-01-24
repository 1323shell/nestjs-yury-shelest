import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { Public } from '../decorators/metadata.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CreateUserDto } from '../users/dto/create.dto';
import { FindOneUserDto } from '../users/dto/find.dto';

@Controller('auth')
@Serialize(FindOneUserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signupUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.authService.register(userData);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Post('password/forgot')
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<string> {
    return this.authService.forgotPassword(body);
  }
}
