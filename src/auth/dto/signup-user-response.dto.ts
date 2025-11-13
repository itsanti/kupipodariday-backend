import { Expose } from 'class-transformer';
import { IsDate, IsEmail, IsNumber, IsString, Length } from 'class-validator';

export class SignupUserResponseDto {
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
  @IsEmail()
  email: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
