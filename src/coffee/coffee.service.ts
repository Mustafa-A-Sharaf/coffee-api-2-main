/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Repository } from 'typeorm';
import { UpdateRatingDto } from './dto/coffee.dto';
import { CoffeeRating } from './entities/coffee-rating.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CoffeeService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(CoffeeRating)
    private readonly ratingRepository: Repository<CoffeeRating>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  //cache
  // async findAll() {
  //   let coffee = await this.cacheManager.get('coffee');
  //   if (!coffee) {
  //     console.log('from api');
  //     coffee = await this.coffeeRepository.find({ relations: ['ratings'] });
  //     await this.cacheManager.set('coffee', coffee, {
  //       ttl: 1000 * 60 * 60,
  //     } as any);
  //   }
  //   return coffee;
  // }

  // async findAll(): Promise<Coffee[]> {
  //   return this.coffeeRepository.find({ relations: ['ratings'] });
  // }

  // async getAll(): Promise<Coffee[]> {
  //   return await this.coffeeRepository
  //     .createQueryBuilder('coffee')
  //     .leftJoinAndSelect('coffee.ratings', 'ratings')
  //     .getMany();
  // }

  async paginateA(options: IPaginationOptions): Promise<Pagination<Coffee>> {
    const qb = this.coffeeRepository.createQueryBuilder('q');
    qb.orderBy('q.id', 'DESC');
    qb.leftJoinAndSelect('q.ratings', 'ratings');

    return paginate<Coffee>(qb, options);
  }

  async findById(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['ratings'],
    });
    if (!coffee) {
      throw new NotFoundException('Coffee not found');
    }
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
        return { Message: 'Not Found' };
      }
      rating = { ...rating, ...updateRatingDto };
      await this.ratingRepository.save(rating);
    }
    return { Message: 'Updated' };
  }
}
