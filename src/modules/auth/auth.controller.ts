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
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

import { LoginResponse, ResetPasswordToken } from 'src/types';
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
import { LogInOutDto } from './dto/login-out.dto';

@ApiTags('Authentication')
@Controller('auth')
@Serialize(FindOneUserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiBody({ type: LogInOutDto })
  @Post('signup')
  async signupUser(@Body() data: CreateUserDto): Promise<User> {
    return this.authService.register(data);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LogInOutDto })
  @Post('login')
  async login(@CurrentUser() user: User): Promise<LoginResponse> {
    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @Get('profile')
  getProfile(@CurrentUser() user: User): User {
    return user;
  }

  @ApiBearerAuth()
  // body may be empty because of some validation decorators in DTO
  // try to use @ApiProperty in DTO to avoid this issue
  @ApiBody({ type: ChangePasswordDto })
  @Put('password')
  changePassword(@Body() body: ChangePasswordDto): Promise<User> {
    return this.authService.changePassword(body);
  }

  @Public()
  @ApiQuery({ name: 'resetPasswordToken', description: 'Reset password token' })
  @ApiBody({ type: ResetPasswordDto })
  @Post('password/reset')
  resetPassword(
    @Query() query: ResetPasswordToken,
    @Body() body: ResetPasswordDto,
  ): Promise<User> {
    return this.authService.resetPassword(query, body);
  }

  @Public()
  @ApiBody({ type: RefreshTokenDto })
  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenDto): Promise<LoginResponse> {
    return this.authService.refreshToken(body);
  }

  @Public()
  @ApiBody({ type: ForgotPasswordDto })
  @Post('password/forgot')
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<string> {
    return this.authService.forgotPassword(body);
  }
}
