import { IsNotEmpty, IsString, IsDateString, IsUrl, IsInt } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  release_date: string;

  @IsUrl()
  cover_url: string;

  @IsInt()
  artist_id: number;
}