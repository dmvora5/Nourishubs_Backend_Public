import { Module } from '@nestjs/common';
import { FoodchartService } from './foodchart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorDay } from './models/vendorDay.schema';
import { VendorSchema } from 'src/api/v1/users/models/user.schema';
import { VendorDayRepository } from './vendorday.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VendorDay.name, schema: VendorSchema }
    ])
  ],
  providers: [FoodchartService, VendorDayRepository],
  exports: [FoodchartService, VendorDayRepository]
})
export class FoodchartModule { }
