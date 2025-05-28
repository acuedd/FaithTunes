import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { minioClient } from '../shared/utils/minio.client';
import * as path from 'path';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) { }

  sanitizeFilename(filename: string): string {
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    const clean = name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();
    return `${clean}${ext}`;
  }

  async create(data: Partial<Song>): Promise<Song> {
    const song = this.songRepository.create(data);
    return this.songRepository.save(song);
  }

  async findAll(): Promise<Song[]> {
    return this.songRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<Song> {
    const song = await this.songRepository.findOneBy({ id });
    if (!song) throw new NotFoundException('Canción no encontrada');
    return song;
  }

  async update(id: number, data: Partial<Song>): Promise<Song> {
    await this.songRepository.update(id, data);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const song = await this.findById(id);
    await this.songRepository.delete(id);

    try {
      const url = new URL(song.permaUrl);
      const objectName = decodeURIComponent(url.pathname.replace(/^\//, '').replace(/^songs\//, ''));
      await minioClient.removeObject('songs', objectName);
    } catch (err) {
      console.error('Error eliminando archivo en MinIO:', err);
    }
  }
}