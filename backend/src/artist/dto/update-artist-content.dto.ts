import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistContentDto } from './create-artist-content.dto';

export class UpdateArtistContentDto extends PartialType(CreateArtistContentDto) { }