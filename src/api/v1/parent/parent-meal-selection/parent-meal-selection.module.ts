import { Module } from '@nestjs/common';
import { ParentMealSelectionService } from './parent-meal-selection.service';
import { ParentMealSelectionController } from './parent-meal-selection.controller';
import { MealSelectionModule } from 'src/modules/meal-selection/meal-selection.module';
import { KidModule } from 'src/modules/kids/kid.module';

@Module({
  imports:[
    MealSelectionModule,
    KidModule
  ],
  controllers: [ParentMealSelectionController],
  providers: [ParentMealSelectionService],
})
export class ParentMealSelectionModule {}
