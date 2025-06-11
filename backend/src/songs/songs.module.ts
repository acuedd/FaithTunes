import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { Song } from './entities/song.entity';
import { ArtistContent } from '../artist/entities/artist-content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, ArtistContent])],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService, TypeOrmModule]
})
export class SongsModule { }