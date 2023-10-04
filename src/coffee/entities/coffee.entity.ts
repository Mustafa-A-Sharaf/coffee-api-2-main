/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CoffeeRating } from './coffee-rating.entity';

@Entity()
export class Coffee {
  save(): Coffee | PromiseLike<Coffee> {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => CoffeeRating, (rating) => rating.coffee)
  ratings: CoffeeRating[];
}
