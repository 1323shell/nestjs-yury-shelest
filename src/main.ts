import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { PrismaService } from './db/prisma.service';
import { AllExceptionsFilter } from './helpers/http-exeption.filter';
import { Swagger } from './helpers/swagger';

const { APP_PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swagger = new Swagger(app);
  swagger.init();

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(APP_PORT || 3000);
}
bootstrap();
