/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { Coffee } from './entities/coffee.entity';
import { UpdateRatingDto } from './dto/coffee.dto';

@Controller('coffee')
export class CoffeeController {
  constructor(private coffeeService: CoffeeService) {}

  @Get()
  async getAllCoffee(): Promise<Coffee[]> {
    return this.coffeeService.findAll();
  }
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Coffee> {
    return this.coffeeService.findById(id);
  }

  @Get(':id/rating')
  async findRatingById(@Param('id') id: string) {
    const rating = await this.coffeeService.findRatingById(id);
    return rating;
  }

  @Patch(':coffeeId/rating/:ratingId')
  async updateRating(
    @Param('coffeeId') coffeeId: string,
    @Param('ratingId') ratingId: number,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    const updatedCoffee = await this.coffeeService.updateRating(
      coffeeId,
      ratingId,
      updateRatingDto,
    );
    return updatedCoffee;
  }
}
