import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  Request,
  UseInterceptors, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { AddSongDto } from './dto/add-song.dto'; // importa tu DTO
import { Playlist } from './entities/playlist.entity';
import { minioClient } from '../shared/utils/minio.client';
import { randomUUID } from 'crypto';

@ApiTags('Playlists')
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        isPublic: { type: 'boolean' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  async create(
    @Body() body: any,
    @UploadedFile() image: Express.Multer.File,
    @Request() req
  ): Promise<Playlist> {
    const dto: CreatePlaylistDto = {
      title: body.title,
      description: body.description,
      isPublic: body.isPublic === 'true',
    };
    const playlist = await this.playlistsService.create(dto, req.user);

    if (image) {
      const fileName = `playlist-cover-${randomUUID()}-${image.originalname}`;
      const bucketName = 'playlists';

      const exists = await minioClient.bucketExists(bucketName);
      if (!exists) {
        await minioClient.makeBucket(bucketName);
      }

      await minioClient.putObject(
        bucketName,
        fileName,
        image.buffer,
        image.size,
        { 'Content-Type': image.mimetype }
      );

      const imageUrl = `${process.env.MINIO_PUBLIC_URL}/${bucketName}/${fileName}`;
      await this.playlistsService.setPlaylistImage(playlist.id, imageUrl);
    }

    return playlist;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<Playlist[]> {
    return this.playlistsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Playlist> {
    const playlist = await this.playlistsService.findById(id);
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }
    return playlist;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.playlistsService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreatePlaylistDto>,
  ): Promise<Playlist> {
    return this.playlistsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async findMine(@Request() req): Promise<Playlist[]> {
    return this.playlistsService.findAllByUser(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':playlistId/songs/:songId')
  @ApiParam({ name: 'playlistId', type: Number })
  @ApiParam({ name: 'songId', type: Number })
  async removeSongFromPlaylist(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<void> {
    return this.playlistsService.removeSongFromPlaylist(playlistId, songId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/songs')
  @ApiParam({ name: 'id', type: Number })
  async addSongToPlaylist(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddSongDto,
  ): Promise<Playlist> {
    return this.playlistsService.addSongToPlaylist(id, dto.songId);
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({ name: 'id', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileName = `playlist-cover-${randomUUID()}-${file.originalname}`;
    const bucketName = 'playlists';

    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
    }

    await minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );
    const imageUrl = `${process.env.MINIO_PUBLIC_URL}/${bucketName}/${fileName}`;
    return this.playlistsService.setPlaylistImage(id, imageUrl);
  }
}