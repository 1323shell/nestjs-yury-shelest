import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import helmet from 'helmet';
import { join } from 'path';

import { AuthModule } from './modules/auth/auth.module';
import { EmailsModule } from './modules/emails/emails.module';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './db/prisma.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { UsersResolver } from './modules/users/users.resolver';
import { PostsResolver } from './modules/posts/posts.resolver';

@Module({
  imports: [
    // AuthModule,
    // EmailsModule,
    // PostsModule,
    PrismaModule,
    UsersModule,
    // UsersResolver,
    // PostsResolver,
    GraphQLModule.forRoot({
      // turn off for production
      debug: true,
      playground: true,

      // autoSchemaFile: join(process.cwd(), 'src/db/schema.gql'),
      autoSchemaFile: true,
      // sortSchema: true,

      // subscriptions are like a WebSockets
      // https://docs.nestjs.com/graphql/subscriptions

      // subscriptions: {
      //   'graphql-ws': true,
      // },

      // buildSchemaOptions: {
      //   dateScalarMode: 'timestamp',
      // },
    }),
  ],
  providers: [],
  // providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // helmet causes infinite loading in GraphiQL playground
    // consumer.apply(helmet()).forRoutes('*');
  }
}
