import { Module } from '@nestjs/common';

import { EmailsModule } from '../emails/emails.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  imports: [EmailsModule],
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
