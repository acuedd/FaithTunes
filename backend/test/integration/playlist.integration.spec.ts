
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CreatePlaylistDto } from '../../src/playlists/dto/create-playlist.dto';

describe('PlaylistsController (integration)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    // register and login test user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'playlist@test.com', password: '12345678', name: 'Playlist Tester' });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'playlist@test.com', password: '12345678' });

    jwtToken = loginRes.body.access_token;
  });

  it('should create a new playlist', async () => {
    const dto: CreatePlaylistDto = {
      title: 'Integration Playlist',
      description: 'Created via integration test',
      songIds: [],
      isPublic: false
    };

    const res = await request(app.getHttpServer())
      .post('/playlists')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(dto)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(dto.title);
  });

  it('should fetch all playlists', async () => {
    const res = await request(app.getHttpServer())
      .get('/playlists')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
