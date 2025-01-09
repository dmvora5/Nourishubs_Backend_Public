import { Module } from '@nestjs/common';
import { KidsDashboardService } from './kids-dashboard.service';
import { KidsDashboardController } from './kids-dashboard.controller';
import { KidModule } from 'src/modules/kids/kid.module';

@Module({
  imports: [
    KidModule
  ],
  controllers: [KidsDashboardController],
  providers: [KidsDashboardService],
})
export class KidsDashboardModule {}
