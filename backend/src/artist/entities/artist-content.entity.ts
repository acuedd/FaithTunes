import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Artist } from './artist.entity';
import { Song } from '../../songs/entities/song.entity'; // o Podcast si aplica
import { ArtistRole } from '../dto/create-artist-content.dto';

@Entity('artist_contents')
export class ArtistContent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Song, song => song.artistContents)
  content: Song;   // referencia a la canción
  @Column() contentId: number;

  @ManyToOne(() => Artist, artist => artist.artistContents)
  artist: Artist;  // referencia al artista
  @Column() artistId: number;

  @Column({ type: 'enum', enum: ArtistRole })
  role: ArtistRole;

  @Column({ nullable: true })
  contribution: string;
}
