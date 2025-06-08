import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { minioClient } from '../shared/utils/minio.client';
import * as path from 'path';
import { ArtistContent } from '../artist/entities/artist-content.entity';
import { AddArtistToSongDto } from './dto/add-artist-to-song.dto';

@Injectable()
export class SongsService {
  artistContentRepository: any;
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,

    @InjectRepository(ArtistContent)
    private readonly artistContentRepo: Repository<ArtistContent>,
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

  async create(data: Partial<Song>, userId: number): Promise<Song> {
    const song = this.songRepository.create({
      ...data,
      createdBy: userId,
    });
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

  async update(id: number, data: Partial<Song>, userId: number): Promise<Song> {
    await this.songRepository.update(id, {
      ...data,
      updatedBy: userId,
    });
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

  async addArtistToSong(songId: number, dto: AddArtistToSongDto): Promise<ArtistContent> {
    // 1. Buscar la canción por ID
    const song = await this.songRepository.findOne({ where: { id: songId } });
    if (!song) {
      throw new NotFoundException(`Canción con ID ${songId} no encontrada`);
    }

    // 2. Buscar el artista por ID (del DTO)
    const artist = await this.songRepository.findOne({ where: { id: dto.artistId } });
    if (!artist) {
      throw new NotFoundException(`Artista con ID ${dto.artistId} no encontrado`);
    }

    // 3. Crear la entidad de relación ArtistContent
    const artistContent = this.artistContentRepository.create({
      content: song,
      artist: artist,
      role: dto.role,
      contribution: dto.contribution,
    });
    // 4. Guardar la relación en la base de datos
    return await this.artistContentRepository.save(artistContent);
  }
}