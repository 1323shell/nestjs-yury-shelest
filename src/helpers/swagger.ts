import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export class Swagger {
  private readonly app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }

  public init(): void {
    const options = new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription('NestJS API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(this.app, options);

    SwaggerModule.setup('api', this.app, document);
  }
}
