// src/playlists/dto/add-song.dto.ts
import { IsInt } from 'class-validator';

export class AddSongDto {
  @IsInt()
  songId: number;
}