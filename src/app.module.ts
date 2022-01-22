import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import helmet from 'helmet';

import { AppController } from './app.controller';
import { PrismaService } from './services/prisma.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule, PostsModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet()).forRoutes('*');
  }
}
