import { Module } from '@nestjs/common';

// import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/db/prisma.service';
import { PostsResolver } from './posts.resolver';

@Module({
  controllers: [],
  providers: [PostsResolver, PostsService, PrismaService],
})
export class PostsModule {}
