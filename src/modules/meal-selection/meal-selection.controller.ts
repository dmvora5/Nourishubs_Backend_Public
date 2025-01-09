import { Controller } from '@nestjs/common';
import { MealSelectionService } from './meal-selection.service';

@Controller('meal-selection')
export class MealSelectionController {
  constructor(private readonly mealSelectionService: MealSelectionService) {}
}
