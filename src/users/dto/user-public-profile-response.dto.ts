import { Expose } from 'class-transformer';
import { IsDate, IsNumber, IsString, Length } from 'class-validator';

export class UserPublicProfileResponseDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  @Length(1, 64)
  username: string;

  @Expose()
  @IsString()
  @Length(0, 200)
  about: string;

  @Expose()
  @IsString()
  avatar: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
