import { Module } from '@nestjs/common';
import { DistricExecutiveFoodchartService } from './distric-executive-foodchart.service';
import { DistricExecutiveFoodchartController } from './distric-executive-foodchart.controller';
import { FoodchartModule } from 'src/modules/foodchart/foodchart.module';

@Module({
  imports:[
    FoodchartModule
  ],
  controllers: [DistricExecutiveFoodchartController],
  providers: [DistricExecutiveFoodchartService],
})
export class DistricExecutiveFoodchartModule {}
