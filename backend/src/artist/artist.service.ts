import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { minioClient } from '../shared/utils/minio.client';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) { }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const { socialLinks, ...rest } = createArtistDto;
    const artist = this.artistRepository.create({
      ...rest,
      socialLinks: socialLinks
        ? { ...socialLinks }
        : undefined,
    });
    return await this.artistRepository.save(artist);
  }

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async findOne(id: number): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id: id } });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found.`);
    }
    return artist;
  }

  async update(id: number, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);
    Object.assign(artist, updateArtistDto);
    return this.artistRepository.save(artist);
  }

  async remove(id: number): Promise<void> {
    const artist = await this.findOne(id);

    try {
      if (artist.photoUrl) {
        const bucketName = process.env.MINIO_ARTIST_BUCKET || 'artists';
        const url = new URL(artist.photoUrl);
        const objectName = decodeURIComponent(url.pathname.replace(/^\//, '').replace(/^playlists\//, ''));
        await minioClient.removeObject(bucketName, objectName);
        await this.artistRepository.delete(id);
      }
    } catch (err) {
      console.error('Error eliminando archivo en MinIO:', err);
    }

    await this.artistRepository.remove(artist);
  }

  async setArtistPhoto(id: number, filename: string): Promise<Artist> {
    const artist = await this.findOne(id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found.`);
    }

    artist.photoUrl = filename;
    return this.artistRepository.save(artist);
  }
}