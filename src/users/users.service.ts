import * as bcrypt from 'bcrypt';
import { Like, Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ERROR_MESSAGES } from 'src/constants/errors';

import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { User } from './entities/user.entity';
import { UserRequestInfo } from '../auth/auth-request';
import { TransformUtil } from '../utils/transform.util';
import { UserWishesDto } from '../wishes/dto/user-wishes.dto';
import { WishDto } from '../wishes/dto/wish.dto';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(user: User) {
    return await this.userRepository.save(user);
  }

  async update(
    updateUserDto: UpdateUserDto,
    userInfo: UserRequestInfo,
  ): Promise<UserProfileResponseDto> {
    if (!userInfo) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    }
    if (!!updateUserDto.username || !!updateUserDto.email) {
      const users = await this.userRepository.find({
        where: [
          { email: updateUserDto.email },
          { username: updateUserDto.username },
        ],
      });
      if (
        !!users.length &&
        users.some((value) => value.id != userInfo.userId)
      ) {
        throw new ConflictException(ERROR_MESSAGES.USER_CONFLICT);
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.userRepository.update({ id: userInfo.userId }, updateUserDto);
    return this.findOwn(userInfo);
  }

  async getOwnWishes(userInfo: UserRequestInfo): Promise<WishDto[]> {
    if (!userInfo) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    }
    const wishes = await this.wishRepository.find({
      where: { owner: { id: userInfo.userId } },
      relations: ['owner', 'offers'],
    });
    return TransformUtil.toDtoArray(WishDto, wishes);
  }

  async getWishes(username: string): Promise<UserWishesDto[]> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    const wishes = await this.wishRepository.find({
      where: { owner: { id: user.id } },
      relations: ['offers'],
    });
    return TransformUtil.toDtoArray(UserWishesDto, wishes);
  }

  async findOne(username: string): Promise<UserPublicProfileResponseDto> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    return TransformUtil.toDto(UserPublicProfileResponseDto, user);
  }

  async findOwn(userInfo: UserRequestInfo): Promise<UserProfileResponseDto> {
    if (!userInfo) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);
    }
    const found = await this.userRepository.findOne({
      where: { id: userInfo.userId },
    });
    if (!found) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    return TransformUtil.toDto(UserProfileResponseDto, found);
  }

  async findMany(
    findUsersDto: FindUsersDto,
  ): Promise<UserPublicProfileResponseDto[]> {
    if (!findUsersDto.query?.length) {
      return [];
    }
    const users = await this.userRepository.find({
      where: [
        { email: Like(`%${findUsersDto.query}%`) },
        { username: Like(`%${findUsersDto.query}%`) },
      ],
    });
    return TransformUtil.toDtoArray(UserPublicProfileResponseDto, users);
  }

  async findByUsernameOrEmail(username: string, email?: string) {
    return this.userRepository.findOne({
      where: [{ username: username }, { email: email }],
    });
  }
}
