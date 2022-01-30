import { Module } from '@nestjs/common';

// import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/db/prisma.service';
import { UsersResolver } from './users.resolver';

@Module({
  controllers: [],
  providers: [PrismaService, UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
