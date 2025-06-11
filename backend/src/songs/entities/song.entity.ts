import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ArtistContent } from '../../artist/entities/artist-content.entity';
import { Album } from '../../albums/entities/album.entity'; // ✅ Importa la entidad

@Entity('songs')
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    subtitle: string;

    @Column({ name: 'header_desc', nullable: true })
    headerDesc: string;

    @Column()
    type: string;

    @Column({ name: 'perma_url' })
    permaUrl: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    language: string;

    @Column({ nullable: true })
    year: number;

    @Column({ name: 'play_count', default: 0 })
    playCount: number;

    @Column({ name: 'explicit_content', default: false })
    explicitContent: boolean;

    @Column({ name: 'list_count', default: 0 })
    listCount: number;

    @Column({ name: 'list_type', nullable: true })
    listType: string;

    @Column({ type: 'json', nullable: true })
    list: any;

    @OneToMany(() => ArtistContent, artistContent => artistContent.content)
    artistContents: ArtistContent[];

    @ManyToOne(() => Album, (album) => album.songs, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'album_id' }) // este es el campo en la tabla "songs"
    album: Album;

    @Column({ nullable: true })
    album_id: number;

    @Column({ name: 'authorized', default: false })
    authorized: boolean;

    @Column({ name: 'created_by', nullable: false })
    createdBy: number;

    @Column({ name: 'updated_by', nullable: true })
    updatedBy?: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}