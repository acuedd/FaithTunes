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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { minioClient } from '../shared/utils/minio.client';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { Album } from './entities/album.entity';
import { NotFoundException } from '@nestjs/common';

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new album. Image is optional.',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        release_date: { type: 'string', format: 'date' },
        artist_id: { type: 'number' },
        cover: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['title', 'release_date', 'artist_id'],
    },
  })
  async create(
    @UploadedFile() cover: Express.Multer.File,
    @Body() dto: CreateAlbumDto,
    @Request() req,
  ): Promise<Album> {
    let cover_url: string | null = null;

    if (cover) {
      const bucket = 'covers';
      const filename = `${Date.now()}-${cover.originalname}`;
      const sanitized = this.albumsService.sanitizeFilename(filename);
      await minioClient.putObject(bucket, sanitized, cover.buffer);
      cover_url = `${process.env.PUBLIC_S3_URL}/${bucket}/${sanitized}`;
    }

    return this.albumsService.create({
      ...dto,
      cover_url: cover_url ?? '',
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Album> {
    const album = await this.albumsService.findById(id);
    if (!album) throw new NotFoundException(`Album with ID ${id} not found`);
    return album;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.albumsService.remove(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update an album. You can optionally send a new cover image.',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        release_date: { type: 'string', format: 'date' },
        artist_id: { type: 'number' },
        cover: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() cover: Express.Multer.File,
    @Body() dto: UpdateAlbumDto,
  ): Promise<Album> {
    let cover_url: string | null = null;

    if (cover) {
      const bucket = 'covers';
      const filename = `${Date.now()}-${cover.originalname}`;
      const sanitized = this.albumsService.sanitizeFilename(filename);
      await minioClient.putObject(bucket, sanitized, cover.buffer);
      cover_url = `${process.env.PUBLIC_S3_URL}/${bucket}/${sanitized}`;
    }

    return this.albumsService.update(id, {
      ...dto,
      ...(cover_url ? { cover_url } : {}),
    });
  }
}