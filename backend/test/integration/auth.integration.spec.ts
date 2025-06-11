// test/integration/auth/auth.integration.spec.ts
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

describe('AuthController (integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('/auth/register (POST) - should register user and return tokens', async () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: 'test1234',
      })
      .expect(201);

    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');
  });
});
