import { Repository } from 'typeorm';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRequestInfo } from 'src/auth/auth-request';
import { ERROR_MESSAGES } from 'src/constants/errors';

import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferDto } from './dto/offer.dto';
import { Offer } from './entities/offer.entity';
import { TransformUtil } from '../utils/transform.util';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(
    createOfferDto: CreateOfferDto,
    userInfo: UserRequestInfo,
  ): Promise<OfferDto> {
    if (!userInfo) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    }
    const wish = await this.wishRepository.findOne({
      where: { id: createOfferDto.itemId },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    if (wish.owner.id === userInfo.userId) {
      throw new ForbiddenException(ERROR_MESSAGES.OFFER_OWN_DENY);
    }
    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new UnprocessableEntityException(ERROR_MESSAGES.OFFER_PRICE);
    }

    const offer = await this.offerRepository.save({
      ...createOfferDto,
      user: { id: userInfo.userId },
      item: { id: createOfferDto.itemId },
    });
    await this.wishRepository.increment(
      { id: createOfferDto.itemId },
      'raised',
      createOfferDto.amount,
    );
    return TransformUtil.toDto(OfferDto, offer);
  }

  async findOne(id: number): Promise<OfferDto> {
    const offer = await this.offerRepository.findOne({
      where: { id: id },
      relations: ['item', 'user'],
    });
    if (!offer) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    return TransformUtil.toDto(OfferDto, offer);
  }

  async findAll(userInfo: UserRequestInfo): Promise<OfferDto[]> {
    if (!userInfo) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    }
    const offers = await this.offerRepository.find({
      where: { user: { id: userInfo.userId } },
      relations: ['item', 'user'],
    });
    return TransformUtil.toDtoArray(OfferDto, offers);
  }
}
