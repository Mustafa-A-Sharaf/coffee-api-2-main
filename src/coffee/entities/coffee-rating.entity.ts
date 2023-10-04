/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Coffee } from './coffee.entity';

@Entity()
export class CoffeeRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @ManyToOne(() => Coffee, (coffee) => coffee.ratings)
  coffee: Coffee;
}
