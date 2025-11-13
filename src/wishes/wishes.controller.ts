import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishDto } from './dto/wish.dto';
import { WishPartialDto } from './dto/wish-partial.dto';
import { WishesService } from './wishes.service';
import { AuthRequest } from '../auth/auth-request';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  create(
    @Request() req: AuthRequest,
    @Body() createWishDto: CreateWishDto,
  ): Promise<WishDto> {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  update(
    @Request() req: AuthRequest,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<WishDto> {
    return this.wishesService.update(id, updateWishDto, req.user);
  }

  @Get('top')
  findTop(): Promise<WishPartialDto[]> {
    return this.wishesService.findTop();
  }

  @Get('last')
  findLast(): Promise<WishPartialDto[]> {
    return this.wishesService.findLast();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  findOne(
    @Request() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<WishDto> {
    return this.wishesService.findOne(id, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  removeOne(
    @Request() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<WishDto> {
    return this.wishesService.removeOne(id, req.user);
  }

  @Post(':id/copy')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  copyWish(
    @Request() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<WishDto> {
    return this.wishesService.copyWish(id, req.user);
  }
}
