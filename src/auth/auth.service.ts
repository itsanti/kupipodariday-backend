import * as bcrypt from 'bcrypt';

import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { SigninUserResponseDto } from './dto/signin-user-response.dto';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';
import { ERROR_MESSAGES, PostgresErrorCode } from '../constants/errors';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TransformUtil } from '../utils/transform.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<SignupUserResponseDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    try {
      const user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
        roles: ['user'],
      } as User);
      return TransformUtil.toDto(SignupUserResponseDto, user);
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
      }
    }
  }

  async login(signinUserDto: SigninUserDto): Promise<SigninUserResponseDto> {
    const user = await this.usersService.findByUsernameOrEmail(
      signinUserDto.username,
    );
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsernameOrEmail(username);
    const isEqual = await bcrypt.compare(password, user.password);
    return user && isEqual ? user : null;
  }
}
