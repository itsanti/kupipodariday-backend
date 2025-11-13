import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity('wishes')
export class Wish {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @IsString()
  @Length(1, 250)
  @Column({
    length: 250,
    nullable: false,
  })
  name: string;

  @IsUrl()
  @Column({ nullable: true })
  link: string;

  @IsUrl()
  @Column({ nullable: true })
  image: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Column({ type: 'float', scale: 2 })
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Column({ type: 'float', scale: 2, default: 0 })
  raised: number;

  @IsNumber()
  @Min(0)
  @Column({ default: 0 })
  copied: number;

  @IsString()
  @Length(1, 1024)
  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @IsArray()
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @IsArray()
  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
