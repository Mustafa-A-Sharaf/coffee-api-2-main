import { Module } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeService } from './coffee.service';
import { CoffeeRating } from './entities/coffee-rating.entity';
import { Coffee } from './entities/coffee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, CoffeeRating])],
  controllers: [CoffeeController],
  providers: [CoffeeService],
})
export class CoffeeModule {}
