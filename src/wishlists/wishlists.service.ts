import { Repository } from 'typeorm';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRequestInfo } from 'src/auth/auth-request';
import { ERROR_MESSAGES } from 'src/constants/errors';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistDto } from './dto/wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { TransformUtil } from '../utils/transform.util';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async findAll(): Promise<WishlistDto[]> {
    const wishlists = await this.wishlistRepository.find({
      relations: ['owner'],
    });
    return TransformUtil.toDtoArray(WishlistDto, wishlists);
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    userInfo: UserRequestInfo,
  ): Promise<WishlistDto> {
    if (!userInfo)
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    const items = createWishlistDto.itemsId.length
      ? await this.wishRepository.find({
          where: createWishlistDto.itemsId.map((id) => ({ id })),
        })
      : [];
    const wishlist = await this.wishlistRepository.save({
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      owner: { id: userInfo.userId },
      items,
    });
    return TransformUtil.toDto(WishlistDto, wishlist);
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userInfo: UserRequestInfo,
  ): Promise<WishlistDto> {
    if (!userInfo)
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userInfo.userId)
      throw new ForbiddenException(ERROR_MESSAGES.WISHLIST_UPDATE);
    if (updateWishlistDto.itemsId) {
      const items = await this.wishRepository.find({
        where: updateWishlistDto.itemsId.map((id) => ({ id })),
      });
      await this.wishlistRepository.save({ id, items });
    }
    await this.wishlistRepository.update(
      { id },
      {
        name: updateWishlistDto.name,
        image: updateWishlistDto.image,
      },
    );
    return this.findOne(id);
  }

  async removeOne(id: number, userInfo: UserRequestInfo): Promise<WishlistDto> {
    if (!userInfo)
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userInfo.userId)
      throw new ForbiddenException(ERROR_MESSAGES.WISHLIST_DELETE);
    await this.wishlistRepository.delete({ id });
    return wishlist;
  }

  async findOne(id: number): Promise<WishlistDto> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    if (!wishlist) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    return TransformUtil.toDto(WishlistDto, wishlist);
  }
}
