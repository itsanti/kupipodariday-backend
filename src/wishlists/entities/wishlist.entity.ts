import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity('wishlists')
export class Wishlist {
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
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @IsArray()
  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  @JoinTable({
    name: 'wishlist_wishes',
    joinColumn: {
      name: 'wishlistId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'wishId',
      referencedColumnName: 'id',
    },
  })
  items: Wish[];
}
