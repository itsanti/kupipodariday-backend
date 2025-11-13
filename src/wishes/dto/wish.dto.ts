import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

import { OfferDto } from '../../offers/dto/offer.dto';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { WishlistDto } from '../../wishlists/dto/wishlist.dto';

export class WishDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsString()
  @Length(1, 250)
  name: string;

  @Expose()
  @IsUrl()
  link: string;

  @Expose()
  @IsUrl()
  image: string;

  @Expose()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @Expose()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  raised: number;

  @Expose()
  @IsString()
  @Length(1, 1024)
  description: string;

  @Expose()
  @Type(() => UserPublicProfileResponseDto)
  owner: UserPublicProfileResponseDto;

  @Expose()
  @Type(() => OfferDto)
  @IsArray()
  offers: OfferDto[];

  @Expose()
  @Type(() => WishlistDto)
  @IsArray()
  wishlists: WishlistDto[];
}
