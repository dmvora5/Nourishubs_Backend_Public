import { Module } from '@nestjs/common';
import { VerificationRequestsService } from './verification-requests.service';
import { VerificationRequestsRepository } from './verification-request.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationRequests, VerificationRequestsSchema } from './models/vendorRequest.schemas';
import { UsersModule } from 'src/api/v1/users/users.module';
import { UsernotificationModule } from 'src/api/v1/usernotification/usernotification.module';

@Module({
  imports: [
    UsersModule,
    UsernotificationModule,
    MongooseModule.forFeature([
      { name: VerificationRequests.name, schema: VerificationRequestsSchema }
    ])
  ],
  providers: [VerificationRequestsService, VerificationRequestsRepository],
  exports: [VerificationRequestsService, VerificationRequestsRepository],
})
export class VerificationRequestsModule { }
