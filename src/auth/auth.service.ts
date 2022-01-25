import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { UsersService } from '../users/users.service';
import { EmailsService } from '../emails/emails.service';
import { generateHash, verifyPassword } from '../services/password';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginResponse } from '../types';

const BASE_URL = process.env.BASE_URL;
const JWT_REFRESH = process.env.JWT_REFRESH;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailsService: EmailsService,
    private jwtService: JwtService,
  ) {}

  private async decodeUser(token: string, secretOrPublicKey: string) {
    const { sub } = jwt.verify(token, secretOrPublicKey) as JwtPayload;

    const user = await this.usersService.findOne({ id: parseInt(sub, 10) });

    return user;
  }

  private async generatePasswordResetToken(user: User): Promise<string> {
    const resetPasswordToken = await bcrypt.hash(user.email, SALT_ROUNDS);

    const resetPasswordExpiresAt = new Date();
    resetPasswordExpiresAt.setDate(resetPasswordExpiresAt.getDate() + 1);

    await this.usersService.update(user.id, {
      resetPasswordExpiresAt,
      resetPasswordToken,
    });

    return resetPasswordToken;
  }

  private generateRefreshToken(id: number): string {
    return jwt.sign({ sub: id }, JWT_REFRESH, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  }

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

  login(user: User): LoginResponse {
    const payload = { email: user.email, sub: user.id };

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.generateRefreshToken(user.id),
    };
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenDto): Promise<LoginResponse> {
    const user = await this.decodeUser(refreshToken, JWT_REFRESH);

    return this.login(user);
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<string> {
    const user = await this.usersService.findOne(data);

    if (!user) {
      throw new NotFoundException(`User with email ${data.email} is not found`);
    }

    const resetPasswordToken = await this.generatePasswordResetToken(user);

    const url = await this.emailsService.sendMail({
      from: 'test@gmail.com',
      to: user.email,
      subject: 'Forgot Password',
      html: `<div>
        <p>Your refresh token: </p>
        <a href="${`${BASE_URL}?token=${resetPasswordToken}`}">Refresh password</a>
      </div>`,
    });

    return `Refresh token was successfully sent to your email. Follow the link to get more info: ${url}`;
  }
}
