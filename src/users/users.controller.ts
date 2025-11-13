import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { UsersService } from './users.service';
import { AuthRequest } from '../auth/auth-request';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { UserWishesDto } from '../wishes/dto/user-wishes.dto';
import { WishDto } from '../wishes/dto/wish.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@Request() req: AuthRequest): Promise<UserProfileResponseDto> {
    return this.usersService.findOwn(req.user);
  }

  @Patch('me')
  update(
    @Request() req: AuthRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.update(updateUserDto, req.user);
  }

  @Get('me/wishes')
  getOwnWishes(@Request() req: AuthRequest): Promise<WishDto[]> {
    return this.usersService.getOwnWishes(req.user);
  }

  @Get(':username')
  findOne(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.findOne(username);
  }

  @Get(':username/wishes')
  getWishes(@Param('username') username: string): Promise<UserWishesDto[]> {
    return this.usersService.getWishes(username);
  }

  @Post('find')
  @HttpCode(HttpStatus.CREATED)
  findMany(
    @Body() findUsersDto: FindUsersDto,
  ): Promise<UserPublicProfileResponseDto[]> {
    return this.usersService.findMany(findUsersDto);
  }
}
