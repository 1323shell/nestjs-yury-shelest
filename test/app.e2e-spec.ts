import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should get a JWT then successfully make a call', async () => {
    const email = '1@1.com';

    const loginReq = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'changeme' })
      .expect(201);

    const token = loginReq.body.accessToken;

    return request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect({ sub: 1, email });
  });

  afterEach(async () => {
    await app.close();
  });
});
