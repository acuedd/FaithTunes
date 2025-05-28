import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber, } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSongDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  subtitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  headerDesc?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  language?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  year?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  permaUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  playCount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  explicitContent?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  listCount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  list?: any;
}