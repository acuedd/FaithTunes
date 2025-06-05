import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsDateString, IsUrl, IsInt, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  release_date: string;

  @IsOptional()
  @IsUrl()
  cover_url: string;

  @Type(() => Number)
  @IsInt()
  artist_id: number;
}