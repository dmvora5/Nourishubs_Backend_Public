import { Module } from '@nestjs/common';
import { SchoolAdminFoodchartService } from './school-admin-foodchart.service';
import { SchoolAdminFoodchartController } from './school-admin-foodchart.controller';
import { FoodchartModule } from 'src/modules/foodchart/foodchart.module';

@Module({
  imports:[
    FoodchartModule
  ],
  controllers: [SchoolAdminFoodchartController],
  providers: [SchoolAdminFoodchartService],
})
export class SchoolAdminFoodchartModule {}
