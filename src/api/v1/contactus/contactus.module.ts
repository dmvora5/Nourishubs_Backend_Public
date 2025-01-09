import { Module } from '@nestjs/common';
import { ContactusService } from './contactus.service';
import { ContactusController } from './contactus.controller';
import { ContactUsRepository } from './contactus.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Contactus, ContactusSchema } from './models/contactus.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contactus.name, schema: ContactusSchema }
    ])
  ],
  controllers: [ContactusController],
  providers: [ContactusService, ContactUsRepository],
  exports: [ContactusService],
})
export class ContactusModule { }
