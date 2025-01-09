import { Module } from '@nestjs/common';
import { KidService } from './kid.service';
import { UsersModule } from '../../api/v1/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Kids, KidSchema } from './models/kid.schema';
import { KidsRepository } from './kids.repository';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Kids.name, schema: KidSchema }
    ])
  ],
  providers: [KidService, KidsRepository],
  exports: [KidService, KidsRepository]
})
export class KidModule { }
