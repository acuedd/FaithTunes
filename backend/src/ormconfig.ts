import { DataSource } from 'typeorm';
import { Playlist } from './playlists/entities/playlist.entity';
import { Song } from './songs/entities/song.entity';
import { User } from './users/entities/user.entity';

export default new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Playlist, Song, User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});