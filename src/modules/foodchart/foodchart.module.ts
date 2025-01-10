import { Module } from '@nestjs/common';
import { FoodchartService } from './foodchart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorDay } from './models/vendorDay.schema';
import { VendorSchema } from 'src/api/v1/users/models/user.schema';
import { VendorDayRepository } from './vendorday.repository';
import { UsersModule } from 'src/api/v1/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: VendorDay.name, schema: VendorSchema }
    ])
  ],
  providers: [FoodchartService, VendorDayRepository],
  exports: [FoodchartService, VendorDayRepository]
})
export class FoodchartModule { }
