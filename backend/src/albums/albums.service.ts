
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) { }

  sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  }

  async create(dto: CreateAlbumDto): Promise<Album> {
    const album = this.albumRepository.create(dto);
    return this.albumRepository.save(album);
  }

  async findAll(): Promise<Album[]> {
    return this.albumRepository.find({ relations: ['artist'] });
  }

  async findById(id: number): Promise<Album | null> {
    return this.albumRepository.findOne({ where: { id }, relations: ['artist'] });
  }

  async update(id: number, dto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumRepository.preload({ id, ...dto });
    if (!album) throw new NotFoundException(`Album with ID ${id} not found`);
    return this.albumRepository.save(album);
  }

  async remove(id: number): Promise<void> {
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
  }
}