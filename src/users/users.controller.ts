import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { Public } from '../decorators/metadata.decorator';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  async signupUser(
    @Body() userData: { email: string; password: string },
  ): Promise<User> {
    return this.usersService.createUser(userData);
  }
}
