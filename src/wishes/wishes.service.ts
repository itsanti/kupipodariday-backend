import { Repository } from 'typeorm';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ERROR_MESSAGES } from 'src/constants/errors';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishDto } from './dto/wish.dto';
import { WishPartialDto } from './dto/wish-partial.dto';
import { Wish } from './entities/wish.entity';
import { UserRequestInfo } from '../auth/auth-request';
import { TransformUtil } from '../utils/transform.util';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(
    createWishDto: CreateWishDto,
    userInfo: UserRequestInfo,
  ): Promise<WishDto> {
    if (!userInfo)
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    const wish = await this.wishRepository.save({
      ...createWishDto,
      owner: { id: userInfo.userId },
    });
    return TransformUtil.toDto(WishDto, wish);
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    userInfo: UserRequestInfo,
  ): Promise<WishDto> {
    if (!userInfo)
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    const wish = await this.findOneCommon(id);
    if (wish.owner.id !== userInfo.userId)
      throw new ForbiddenException(ERROR_MESSAGES.WISH_NOT_OWN_UPDATE);
    if (wish.raised > 0 && updateWishDto.price != wish.price)
      throw new ForbiddenException(ERROR_MESSAGES.WISH_WILLING_CHANGE_PRICE);
    await this.wishRepository.update({ id }, updateWishDto);
    return this.findOneCommon(id);
  }

  async findOne(id: number, userInfo: UserRequestInfo): Promise<WishDto> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
    if (!wish) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    if (wish.owner.id !== userInfo?.userId) {
      wish.offers.forEach((value) => {
        if (value.hidden) {
          value.amount = 0;
        }
      });
    }
    return TransformUtil.toDto(WishDto, wish);
  }

  async findLast(): Promise<WishPartialDto[]> {
    const wishes = await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers'],
    });
    return TransformUtil.toDtoArray(WishPartialDto, wishes);
  }

  async findTop(): Promise<WishPartialDto[]> {
    const wishes = await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 10,
      relations: ['owner', 'offers'],
    });
    return TransformUtil.toDtoArray(WishPartialDto, wishes);
  }

  private async findOneCommon(id: number): Promise<WishDto> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['offers', 'owner'],
    });
    if (!wish) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    return TransformUtil.toDto(WishDto, wish);
  }

  async removeOne(id: number, userInfo: UserRequestInfo): Promise<WishDto> {
    if (!userInfo)
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    const wish = await this.findOneCommon(id);
    if (wish.owner.id !== userInfo.userId)
      throw new ForbiddenException(ERROR_MESSAGES.WISH_REMOVE);
    await this.wishRepository.delete({ id });
    return wish;
  }

  async copyWish(id: number, userInfo: UserRequestInfo): Promise<WishDto> {
    if (!userInfo)
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    const original = await this.findOneCommon(id);
    if (original.owner.id === userInfo.userId)
      throw new ForbiddenException(ERROR_MESSAGES.WISH_COPY);
    const copy = await this.wishRepository.save({
      name: original.name,
      link: original.link,
      image: original.image,
      price: original.price,
      description: original.description,
      owner: { id: userInfo.userId },
    });
    await this.wishRepository.increment({ id: original.id }, 'copied', 1);
    return TransformUtil.toDto(WishDto, copy);
  }
}
