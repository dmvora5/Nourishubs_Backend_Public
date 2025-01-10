import { Module } from '@nestjs/common';
import { VendorDashbordService } from './vendor-dashbord.service';
import { VendorDashbordController } from './vendor-dashbord.controller';
import { OrdersModule } from 'src/modules/orders/orders.module';

@Module({
  imports:[
    OrdersModule
  ],
  controllers: [VendorDashbordController],
  providers: [VendorDashbordService],
})
export class VendorDashbordModule {}
