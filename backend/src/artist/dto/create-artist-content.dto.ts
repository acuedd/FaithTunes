// src/artists/dto/create-artist-content.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum ArtistRole {
  PRIMARY = 'primary',
  FEATURED = 'featured',
  GUEST = 'guest',
  HOST = 'host',
}

export class CreateArtistContentDto {
  @IsNumber()
  artistId: number;

  @IsNumber()
  contentId: number;

  @IsEnum(ArtistRole)
  role: ArtistRole;

  @IsString()
  @IsOptional()
  contribution?: string;
}

