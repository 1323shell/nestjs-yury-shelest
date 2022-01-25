import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import helmet from 'helmet';

import { AuthModule } from './auth/auth.module';
import { EmailsModule } from './emails/emails.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './services/prisma.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [AuthModule, EmailsModule, PostsModule, UsersModule],
  providers: [PrismaService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet()).forRoutes('*');
  }
}
