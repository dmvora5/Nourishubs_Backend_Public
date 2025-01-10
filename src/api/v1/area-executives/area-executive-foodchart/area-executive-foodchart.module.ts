import { Module } from '@nestjs/common';
import { AreaExecutiveFoodchartService } from './area-executive-foodchart.service';
import { AreaExecutiveFoodchartController } from './area-executive-foodchart.controller';
import { FoodchartModule } from 'src/modules/foodchart/foodchart.module';

@Module({
  imports: [
    FoodchartModule
  ],
  controllers: [AreaExecutiveFoodchartController],
  providers: [AreaExecutiveFoodchartService],
})
export class AreaExecutiveFoodchartModule { }
