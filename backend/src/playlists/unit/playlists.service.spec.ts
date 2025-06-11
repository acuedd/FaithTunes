import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsService } from '../playlists.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Playlist } from '../entities/playlist.entity';
import { Song } from '../../songs/entities/song.entity';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { features } from 'process';

describe('PlaylistsService', () => {
  let service: PlaylistsService;
  let playlistRepo: jest.Mocked<Repository<Playlist>>;
  let songRepo: jest.Mocked<Repository<Song>>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPlaylist: Playlist = {
    id: 1,
    title: 'My Playlist',
    description: 'desc',
    user: mockUser,
    songs: [],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistsService,
        {
          provide: getRepositoryToken(Playlist),
          useValue: {
            find: jest.fn(),
            findBy: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Song),
          useValue: {
            findBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlaylistsService>(PlaylistsService);
    playlistRepo = module.get(getRepositoryToken(Playlist));
    songRepo = module.get(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a playlist', async () => {
    const dto = { title: 'My Playlist', description: 'desc', songIds: [] };

    (playlistRepo.create as jest.Mock).mockReturnValue(mockPlaylist);
    (playlistRepo.save as jest.Mock).mockResolvedValue(mockPlaylist);

    const result = await service.create(dto, mockUser);

    expect(result).toEqual(mockPlaylist);
    expect(playlistRepo.create).toHaveBeenCalledWith({
      title: dto.title,
      description: dto.description,
      songs: [],
      user: mockUser,
      isPublic: false,
      featured: false,
    });
    expect(playlistRepo.save).toHaveBeenCalledWith(mockPlaylist);
  });

  it('should return all playlists', async () => {
    (playlistRepo.find as jest.Mock).mockResolvedValue([mockPlaylist]);

    const result = await service.findAll();

    expect(result).toEqual([mockPlaylist]);
    expect(playlistRepo.find).toHaveBeenCalled();
  });

  it('should return playlists by user', async () => {
    (playlistRepo.findBy as jest.Mock).mockResolvedValue([mockPlaylist]);

    const result = await service.findAllByUser(mockUser);

    expect(result).toEqual([mockPlaylist]);
    expect(playlistRepo.findBy).toHaveBeenCalledWith({ user: { id: mockUser.id } });
  });

  it('should delete a playlist', async () => {
    (playlistRepo.delete as jest.Mock).mockResolvedValue({ affected: 1 });

    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(playlistRepo.delete).toHaveBeenCalledWith(1);
  });
});