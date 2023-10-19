/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators';
import { CoffeeService } from './coffee.service';
import { Coffee } from './entities/coffee.entity';
import { UpdateRatingDto } from './dto/coffee.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
@Controller('coffee')
export class CoffeeController {
  constructor(private coffeeService: CoffeeService) {}

  // @Get()
  // @UseInterceptors(CacheInterceptor)
  // async getAllCoffee() {
  //   return await this.coffeeService.findAll();
  // }

  // @Get()
  // @UseInterceptors(CacheInterceptor)
  // @CacheKey('coffee')
  // @CacheTTL(1000 * 60 * 60)
  // async getAllCoffee(): Promise<Coffee[]> {
  //   console.log('Done');
  //   return this.coffeeService.findAll();
  // }

  // get pagination
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000 * 60 * 60)
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number = 1,
  ): Promise<Pagination<Coffee>> {
    const options: IPaginationOptions = {
      limit,
      page,
    };
    return await this.coffeeService.paginateA(options);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000 * 60 * 60)
  async findById(@Param('id') id: string): Promise<Coffee> {
    return this.coffeeService.findById(id);
  }

  @Get(':id/rating')
  async findRatingById(@Param('id') id: string) {
    const rating = await this.coffeeService.findRatingById(id);
    return rating;
  }

  @Patch(':coffeeId/:ratingId')
  async updateRating(
    @Param('coffeeId') coffeeId: string,
    @Param('ratingId') ratingId: number,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    const updateCoffee = await this.coffeeService.updateRating(
      coffeeId,
      ratingId,
      updateRatingDto,
    );
    return updateCoffee;
  }
}
