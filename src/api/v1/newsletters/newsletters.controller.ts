import { Controller } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}
}
