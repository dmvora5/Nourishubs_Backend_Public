import { Module } from '@nestjs/common';
import { IssueReportingService } from './issue-reporting.service';
import { IssueReportingController } from './issue-reporting.controller';
import { IssueRepotingRepository } from './isuee-reporting.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Issue, IssueSchema } from './models/issueReporting.schemas';
import { KidModule } from 'src/modules/kids/kid.module';
import { OrdersModule } from 'src/modules/orders/orders.module';

@Module({
  imports: [
    KidModule,
    OrdersModule,
    MongooseModule.forFeature([
      { name: Issue.name, schema: IssueSchema }
    ])
  ],
  controllers: [IssueReportingController],
  providers: [IssueReportingService, IssueRepotingRepository],
  exports: [IssueReportingService, IssueRepotingRepository]
})
export class IssueReportingModule { }
