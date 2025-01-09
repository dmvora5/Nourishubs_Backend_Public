import { Module } from '@nestjs/common';
import { DisputeResolutionService } from './dispute-resolution.service';
import { DisputeResolutionController } from './dispute-resolution.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DisputeResolution, DisputeSchema } from './models/disputeResolution.schemas';
import { DisputeResolutionRepository } from './dispute-resolution.repository';
import { IssueReportingModule } from '../issue-reporting/issue-reporting.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    IssueReportingModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: DisputeResolution.name, schema: DisputeSchema }
    ])
  ],
  controllers: [DisputeResolutionController],
  providers: [DisputeResolutionService, DisputeResolutionRepository],
  exports: [DisputeResolutionService, DisputeResolutionRepository]
})
export class DisputeResolutionModule { }
