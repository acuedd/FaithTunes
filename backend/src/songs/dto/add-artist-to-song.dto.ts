import { IsUUID, IsEnum, IsOptional, IsString, IsInt } from "class-validator";
import { ArtistRole } from "../../artist/dto/create-artist-content.dto";

export class AddArtistToSongDto {
  @IsInt({ message: 'El artistId debe ser un número entero' })
  artistId: number;

  @IsEnum(ArtistRole, { message: 'El role debe ser uno de los valores válidos de ArtistRole' })
  role: 'primary' | 'featured' | 'guest' | 'host';

  @IsOptional()
  @IsString({ message: 'La contribución debe ser un texto' })
  contribution?: string;
}