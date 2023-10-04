/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Repository } from 'typeorm';
import { UpdateRatingDto } from './dto/coffee.dto';
import { CoffeeRating } from './entities/coffee-rating.entity';

@Injectable()
export class CoffeeService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(CoffeeRating)
    private readonly ratingRepository: Repository<CoffeeRating>,
  ) {}

  async findAll(): Promise<Coffee[]> {
    return this.coffeeRepository.find({ relations: ['ratings'] });
  }

  async findById(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['ratings'],
    });
    return coffee;
  }

  async findRatingById(id: string) {
    const coffee = await this.findById(id);
    return coffee.ratings;
  }

  async updateRating(
    coffeeId: string,
    ratingId: number,
    updateRatingDto: UpdateRatingDto,
  ) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: coffeeId },
      relations: ['ratings'],
    });
    if (coffee) {
      let rating = coffee.ratings.find((rate) => rate.id == ratingId);
      if (!rating) {
        return { message: 'not found' };
      }
      rating = { ...rating, ...updateRatingDto };
      await this.ratingRepository.save(rating);
    }
    return { message: 'done' };
  }
}
