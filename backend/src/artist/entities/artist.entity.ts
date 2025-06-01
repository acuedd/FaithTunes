import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ArtistContent } from './artist-content.entity';
import { Album } from '../../albums/entities/album.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  realName?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: string;

  @Column({ type: 'json', nullable: true })
  socialLinks?: Record<string, string>;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column('simple-array', { nullable: true })
  genres?: string[];

  @Column('simple-array', { nullable: true })
  labels?: string[];

  @OneToMany(() => ArtistContent, ac => ac.artist)
  artistContents: ArtistContent[];

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
