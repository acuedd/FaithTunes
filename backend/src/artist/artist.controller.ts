import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Artist } from './entities/artist.entity';
import { minioClient } from '../shared/utils/minio.client';
import { Roles } from '../shared/decorators/roles.decorator';

@ApiTags('Artists')
@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create artist with optional photo',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        realName: { type: 'string' },
        country: { type: 'string' },
        birthDate: { type: 'string', format: 'date' },
        socialLinks: { type: 'object' },
        bio: { type: 'string' },
        genres: { type: 'array', items: { type: 'string' } },
        labels: { type: 'array', items: { type: 'string' } },
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @Body(new DefaultValuePipe('')) createArtistDto: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Artist> {
    const transformedDto: CreateArtistDto = {
      ...createArtistDto,
      genres: Array.isArray(createArtistDto.genres)
        ? createArtistDto.genres
        : JSON.parse(createArtistDto.genres || '[]'),

      labels: Array.isArray(createArtistDto.labels)
        ? createArtistDto.labels
        : JSON.parse(createArtistDto.labels || '[]'),

      socialLinks:
        typeof createArtistDto.socialLinks === 'object'
          ? createArtistDto.socialLinks
          : JSON.parse(createArtistDto.socialLinks || '{}'),
    };
    const artistData = await this.artistService.create(transformedDto);

    if (file) {
      const fileName = `${artistData.id}-${file.originalname}`;
      const bucketName = process.env.MINIO_ARTIST_BUCKET || 'artists';
      const exists = await minioClient.bucketExists(bucketName);
      if (!exists) {
        await minioClient.makeBucket(bucketName, 'us-east-1');
      }
      await minioClient.putObject(
        bucketName,
        fileName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype }
      );
      const imageUrl = `${process.env.PUBLIC_S3_URL}/${bucketName}/${fileName}`;
      await this.artistService.setArtistPhoto(Number(artistData.id), imageUrl);
    }
    return artistData
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the artist' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.artistService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    description: 'Update artist with optional photo',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        realName: { type: 'string' },
        country: { type: 'string' },
        birthDate: { type: 'string', format: 'date' },
        socialLinks: { type: 'object' },
        bio: { type: 'string' },
        genres: { type: 'array', items: { type: 'string' } },
        labels: { type: 'array', items: { type: 'string' } },
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new DefaultValuePipe('')) updateArtistDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const transformedDto: UpdateArtistDto = {
      ...updateArtistDto,
      genres: Array.isArray(updateArtistDto.genres)
        ? updateArtistDto.genres
        : JSON.parse(updateArtistDto.genres || '[]'),

      labels: Array.isArray(updateArtistDto.labels)
        ? updateArtistDto.labels
        : JSON.parse(updateArtistDto.labels || '[]'),

      socialLinks:
        typeof updateArtistDto.socialLinks === 'object'
          ? updateArtistDto.socialLinks
          : JSON.parse(updateArtistDto.socialLinks || '{}'),
    };
    return this.artistService.update(Number(id), transformedDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the artist' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.artistService.remove(Number(id));
  }

  @Get('public')
  async getPublicPlaylists() {
    return this.artistService.findAll();
  }
}
