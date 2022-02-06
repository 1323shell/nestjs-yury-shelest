import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { LoginResponse, ResetPasswordToken } from 'src/types';
import { UsersService } from '../users/users.service';
import { EmailsService } from '../emails/emails.service';
import { PrismaService } from 'src/db/prisma.service';
import { generateHash, verifyPassword } from 'src/helpers/password';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const BASE_URL = process.env.BASE_URL;
const JWT_REFRESH = process.env.JWT_REFRESH;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private emailsService: EmailsService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  private async decodeUser(
    token: string,
    secretOrPublicKey: string,
  ): Promise<User> {
    const { id } = jwt.verify(token, secretOrPublicKey) as JwtPayload;

    const user = await this.usersService.findOne({ id: parseInt(id, 10) });

    return user;
  }

  private async generatePasswordResetToken(user: User): Promise<string> {
    const resetPasswordToken = await bcrypt.hash(user.email, SALT_ROUNDS);

    const resetPasswordExpiresAt = new Date();
    resetPasswordExpiresAt.setDate(resetPasswordExpiresAt.getDate() + 1);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordExpiresAt, resetPasswordToken },
    });

    return resetPasswordToken;
  }

  private generateRefreshToken(id: number): string {
    return jwt.sign({ id }, JWT_REFRESH, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  }

  private isPasswordResetTokenExpired(user: User): boolean {
    const timeDiff =
      new Date(user.resetPasswordExpiresAt).getTime() - Date.now();

    return timeDiff < 0 || timeDiff > 864e5;
  }

  async validateUser(email: string, password: string): Promise<User | never> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} is not found`);
    }

    if (await verifyPassword(password, user.password)) {
      return user;
    }

    return null;
  }

  async register(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await generateHash(data.password);

    const user = await this.usersService.create(data);

    return user;
  }

  async login(user: User): Promise<LoginResponse> {
    const payload = { email: user.email, id: user.id };

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordExpiresAt: null, resetPasswordToken: null },
    });

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.generateRefreshToken(user.id),
    };
  }

  async changePassword(data: ChangePasswordDto): Promise<User | never> {
    const { email, newPassword, oldPassword } = data;
    const user = await this.validateUser(email, oldPassword);

    if (!user) {
      throw new UnauthorizedException('Invalid password');
    }

    const password = await generateHash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password },
    });

    return user;
  }

  async resetPassword(
    query: ResetPasswordToken,
    data: ResetPasswordDto,
  ): Promise<User | never> {
    const user = await this.usersService.findOne(query);

    if (!user) {
      throw new UnauthorizedException('Password reset token does not exist');
    }

    if (this.isPasswordResetTokenExpired(user)) {
      throw new UnauthorizedException('Password reset token has expired');
    }

    const password = await generateHash(data.password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password,
        resetPasswordExpiresAt: null,
        resetPasswordToken: null,
      },
    });

    return user;
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
        <a href="${`${BASE_URL}/auth/password/reset?resetPasswordToken=${resetPasswordToken}`}">Refresh password</a>
      </div>`,
    });

    return `Refresh token was successfully sent to your email. Follow the link to get more info: ${url}`;
  }
}
