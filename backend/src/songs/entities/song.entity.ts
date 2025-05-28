import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}