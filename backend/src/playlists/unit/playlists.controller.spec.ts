// src/playlists/unit/playlists.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsController } from '../playlists.controller';
import { PlaylistsService } from '../playlists.service';
import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { Playlist } from '../entities/playlist.entity';
import { User } from '../../users/entities/user.entity';

describe('PlaylistsController', () => {
  let controller: PlaylistsController;
  let service: PlaylistsService;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPass',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPlaylist: Playlist = {
    id: 1,
    title: 'Playlist 1',
    description: 'Description',
    user: mockUser,
    songs: [],
    featured: false,
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockPlaylist),
    findAll: jest.fn().mockResolvedValue([mockPlaylist]),
    findAllByUser: jest.fn().mockResolvedValue([mockPlaylist]),
    findById: jest.fn().mockResolvedValue(mockPlaylist),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistsController],
      providers: [
        {
          provide: PlaylistsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PlaylistsController>(PlaylistsController);
    service = module.get<PlaylistsService>(PlaylistsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a playlist', async () => {
    const dto: CreatePlaylistDto = { title: 'Playlist 1', description: 'Description', songIds: [], isPublic: true };
    const result = await controller.create(dto, { user: mockUser } as any);
    expect(result).toEqual(mockPlaylist);
    expect(service.create).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should return all playlists', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockPlaylist]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return playlists by user', async () => {
    const result = await controller.findMine({ user: mockUser } as any);
    expect(result).toEqual([mockPlaylist]);
    expect(service.findAllByUser).toHaveBeenCalledWith(mockUser);
  });

  it('should return a playlist by id', async () => {
    const result = await controller.findById(1);
    expect(result).toEqual(mockPlaylist);
    expect(service.findById).toHaveBeenCalledWith(1);
  });

  it('should delete a playlist', async () => {
    await controller.remove(1);
    expect(service.delete).toHaveBeenCalledWith(1);
  });
});