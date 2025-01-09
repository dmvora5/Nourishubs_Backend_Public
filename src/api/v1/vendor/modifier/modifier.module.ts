import { Module } from '@nestjs/common';
import { ModifierService } from './modifier.service';
import { ModifierController } from './modifier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Modifier, ModifierSchema } from './models/modifier.schema';
import { ModifierRepository } from './modifier.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Modifier.name, schema: ModifierSchema }
    ])
  ],
  controllers: [ModifierController],
  providers: [ModifierService, ModifierRepository],
  exports: [ModifierService, ModifierRepository]
})
export class ModifierModule {}
