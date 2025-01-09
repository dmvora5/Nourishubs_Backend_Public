import { Module } from '@nestjs/common';
import { StaffMealSelectionService } from './staff-meal-selection.service';
import { StaffMealSelectionController } from './staff-meal-selection.controller';
import { MealSelectionModule } from 'src/modules/meal-selection/meal-selection.module';

@Module({
  imports:[
    MealSelectionModule
  ],
  controllers: [StaffMealSelectionController],
  providers: [StaffMealSelectionService],
})
export class StaffMealSelectionModule {}
