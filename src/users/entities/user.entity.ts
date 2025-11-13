import {
  IsArray,
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity('users')
export class User {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(1, 64)
  @Column({
    length: 64,
    unique: true,
    nullable: false,
  })
  username: string;

  @IsString()
  @Length(1, 200)
  @Column({
    length: 200,
    default: 'Пока ничего не рассказал о себе',
  })
  about: string;

  @IsUrl()
  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @IsEmail()
  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @IsArray()
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @IsArray()
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Wish[];

  @IsArray()
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @IsString()
  @Column()
  password: string;

  @IsArray()
  @Column('simple-array', { default: 'user' })
  roles: string[];
}
