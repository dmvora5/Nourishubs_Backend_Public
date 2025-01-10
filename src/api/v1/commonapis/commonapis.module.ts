import { Module } from '@nestjs/common';
import { CommonapisService } from './commonapis.service';
import { CommonapisController } from './commonapis.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[
    UsersModule
  ],
  controllers: [CommonapisController],
  providers: [CommonapisService],
})
export class CommonapisModule {}
