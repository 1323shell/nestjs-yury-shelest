import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';

import { UsersService } from '../users/users.service';
import { generateHash, verifyPassword } from '../services/password';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} is not found`);
    }

    if (await verifyPassword(password, user.password)) {
      const { password: userPassword, ...result } = user;
      return result;
    }

    return null;
  }

  async register(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await generateHash(data.password);

    const user = await this.usersService.create(data);

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, userId: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<string> {
    const user = await this.usersService.findOne(data);

    if (!user) {
      throw new NotFoundException(`User with email ${data.email} is not found`);
    }

    return 'Refresh token was successfully sent to your email';
  }
}
