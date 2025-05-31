import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('artist_contents')
export class ArtistContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  artistId: string;

  @Column()
  contentId: string;

  @Column()
  role: 'primary' | 'featured' | 'guest' | 'host';

  @Column({ nullable: true })
  contribution?: string;
}
