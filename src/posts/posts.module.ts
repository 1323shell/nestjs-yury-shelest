import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from '../services/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    PrismaService,
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class PostsModule {}
