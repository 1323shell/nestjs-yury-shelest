import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { UsersService } from '../users/users.service';
import { verifyPassword } from '../services/password';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUser({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (await verifyPassword(password, user.password)) {
      const { password: userPassword, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, userId: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
