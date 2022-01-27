import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { ResetPasswordToken } from 'src/types';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { Public } from 'src/decorators/metadata.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { CreateUserDto } from '../users/dto/create.dto';
import { FindOneUserDto } from '../users/dto/find.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  @Put('password')
  changePassword(@Body() body: ChangePasswordDto): Promise<User> {
    return this.authService.changePassword(body);
  }

  @Public()
  @Post('password/reset')
  resetPassword(
    @Query() query: ResetPasswordToken,
    @Body() body: ResetPasswordDto,
  ): Promise<User> {
    return this.authService.resetPassword(query, body);
  }

  @Public()
  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body);
  }

  @Public()
  @Post('password/forgot')
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<string> {
    return this.authService.forgotPassword(body);
  }
}
