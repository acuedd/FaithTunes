import { IsBoolean } from "class-validator";

export class UpdateSongAuthorizationDto {
  @IsBoolean()
  isAuthorized: boolean;

}