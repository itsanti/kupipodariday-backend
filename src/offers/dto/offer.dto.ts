import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, Min } from 'class-validator';

import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { WishDto } from '../../wishes/dto/wish.dto';

export class OfferDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;

  @Expose()
  @Type(() => WishDto)
  item: WishDto;

  @Expose()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @Expose()
  @IsBoolean()
  hidden: boolean;

  @Expose()
  @Type(() => UserPublicProfileResponseDto)
  user: UserPublicProfileResponseDto;
}
