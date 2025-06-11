import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { Song } from '../songs/entities/song.entity';
import { User } from '../users/entities/user.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { NotFoundException } from '@nestjs/common';
import { minioClient } from '../shared/utils/minio.client';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,

    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) { }

  async create(dto: CreatePlaylistDto, user: User): Promise<Playlist> {
    const songs = dto.songIds?.length
      ? await this.songRepository.findByIds(dto.songIds)
      : [];

    const playlist = this.playlistRepository.create({
      title: dto.title,
      description: dto.description,
      songs,
      user,
      featured: dto.featured || false,
      isPublic: dto.isPublic || false,
    });

    return this.playlistRepository.save(playlist);
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistRepository.find({ relations: ['songs', 'user'] });
  }

  async findAllByUser(user: User): Promise<Playlist[]> {
    return this.playlistRepository.findBy({ user: { id: user.id } });
  }

  async delete(id: number): Promise<void> {
    const playlist = await this.findById(id);

    try {
      const url = new URL(playlist.image);
      const objectName = decodeURIComponent(url.pathname.replace(/^\//, '').replace(/^playlists\//, ''));
      await minioClient.removeObject('playlists', objectName);
      await this.playlistRepository.delete(id);
    } catch (err) {
      console.error('Error eliminando archivo en MinIO:', err);
    }

  }

  async update(id: number, dto: Partial<CreatePlaylistDto>): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({ where: { id }, relations: ['songs'] });
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    if (dto.title !== undefined) playlist.title = dto.title;
    if (dto.description !== undefined) playlist.description = dto.description;
    if (dto.songIds) {
      playlist.songs = await this.songRepository.findByIds(dto.songIds);
    }
    if (dto.featured !== undefined) playlist.featured = dto.featured;
    if (dto.isPublic !== undefined) playlist.isPublic = dto.isPublic;

    return this.playlistRepository.save(playlist);
  }

  async findById(id: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: ['songs', 'user'],
    });

    if (!playlist) {
      throw new NotFoundException('Playlist no encontrada');
    }

    return playlist;
  }

  async removeSongFromPlaylist(playlistId: number, songId: number): Promise<void> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['songs'],
    });

    if (!playlist) throw new NotFoundException('Playlist not found');

    playlist.songs = playlist.songs.filter((s) => s.id !== songId);
    await this.playlistRepository.save(playlist);
  }

  async addSongToPlaylist(playlistId: number, songId: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['songs'],
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const song = await this.songRepository.findOne({ where: { id: songId } });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    const alreadyExists = playlist.songs.some(s => s.id === songId);
    if (!alreadyExists) {
      playlist.songs.push(song);
      return this.playlistRepository.save(playlist);
    }

    return playlist; // Si ya existe, simplemente la devuelve
  }

  async setPlaylistImage(id: number, filename: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOneBy({ id });
    if (!playlist) throw new NotFoundException('Playlist not found');

    playlist.image = filename;
    return this.playlistRepository.save(playlist);
  }

  async findAllWithAuthorizedSongs() {
    const playlists = await this.playlistRepository.find({
      relations: ['songs'],
    });

    return playlists.map((playlist) => ({
      ...playlist,
      songs: playlist.songs.filter((song) => song.authorized),
    }));
  }
}
