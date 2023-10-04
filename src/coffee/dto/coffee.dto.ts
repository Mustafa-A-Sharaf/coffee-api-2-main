/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CoffeeRating } from '../entities/coffee-rating.entity';

export class UpdateRatingDto extends PartialType(CoffeeRating) {}
