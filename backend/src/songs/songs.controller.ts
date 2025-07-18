import {
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Body,
  Request,
  BadRequestException,
  Get,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { minioClient } from '../shared/utils/minio.client';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { Song } from './entities/song.entity';
import { NotFoundException } from '@nestjs/common';
import { AddArtistToSongDto } from './dto/add-artist-to-song.dto';
import { UpdateSongAuthorizationDto } from './dto/update-song-authorization.dto';


@ApiTags('Songs')
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) { }

  @Get('public')
  async findPublicSongs(): Promise<Song[]> {
    return this.songsService.findAuthorized();
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('audio/mpeg')) {
          return cb(new BadRequestException('Only MP3 files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string' },
        subtitle: { type: 'string' },
        headerDesc: { type: 'string' },
        type: { type: 'string' },
        language: { type: 'string' },
        year: { type: 'number' },
        image: { type: 'string' },
        album_id: { type: 'number' },
      },
      required: ['file', 'title', 'type'],
    },
  })
  async uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateSongDto,
    @Request() req,
  ): Promise<Song> {
    const bucket = 'songs';
    const rawFilename = `${Date.now()}-${file.originalname}`;
    const sanitized = this.songsService.sanitizeFilename(rawFilename);
    await minioClient.putObject(bucket, sanitized, file.buffer);
    const publicUrl = `${process.env.PUBLIC_S3_URL}/${bucket}/${sanitized}`;
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const newSong = await this.songsService.create({
      ...dto,
      permaUrl: publicUrl,
      playCount: 0,
      explicitContent: false,
      listCount: 0,
      list: {},
      authorized: false,
    }, userId);

    return newSong;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<Song[]> {
    return this.songsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    const song = await this.songsService.findById(id);
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return song;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.songsService.remove(id);
  }

  @ApiBody({
    description: 'Update a song including optional album_id.',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        headerDesc: { type: 'string' },
        type: { type: 'string' },
        language: { type: 'string' },
        year: { type: 'number' },
        image: { type: 'string' },
        album_id: { type: 'number' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSongDto,
    @Request() req,
  ): Promise<Song> {
    const userId = req.user?.id;
    return this.songsService.update(id, dto, userId);
  }

  @ApiParam({ name: 'id', type: Number, description: 'ID of the song to which the artist will be added' })
  @ApiBody({
    description: 'Add an artist to a song with role and optional contribution',
    schema: {
      type: 'object',
      properties: {
        artistId: { type: 'number', description: 'ID of the artist' },
        role: {
          type: 'string',
          enum: ['primary', 'featured', 'guest', 'host'],
          description: 'Role of the artist in the song'
        },
        contribution: {
          type: 'string',
          description: 'Short description of the contribution (optional)',
        },
      },
      required: ['artistId', 'role'],
    },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/artists')
  addArtistToSong(
    @Param('id', ParseIntPipe) id: number,    // ParseIntPipe transforma 'id' a número
    @Body() addArtistToSongDto: AddArtistToSongDto
  ) {
    return this.songsService.addArtistToSong(id, addArtistToSongDto);
  }

  @Patch(':id/authorization')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    description: 'Update song authorization status',
    schema: {
      type: 'object',
      properties: {
        isAuthorized: { type: 'boolean', description: 'Indicates if the song is authorized' },
      },
      required: ['isAuthorized'],
    },
  })
  async updateAuthorization(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSongAuthorizationDto,
  ): Promise<Song> {
    return this.songsService.updateAuthorization(id, dto.isAuthorized);
  }
}
