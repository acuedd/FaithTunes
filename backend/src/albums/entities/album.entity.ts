import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';
import { Song } from '../../songs/entities/song.entity';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'date' })
  release_date: Date;

  @Column()
  cover_url: string;

  @ManyToOne(() => Artist, (artist) => artist.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @OneToMany(() => Song, (song) => song.album)
  songs: Song[];

  @Column()
  artist_id: number;
}