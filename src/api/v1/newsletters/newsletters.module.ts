import { Module } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { NewslettersController } from './newsletters.controller';
import { NewsLetterRepository } from './newsletters.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsLetter, NewsLetterSchema } from './models/newsleter.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewsLetter.name, schema: NewsLetterSchema }
    ])
  ],
  controllers: [NewslettersController],
  providers: [NewslettersService, NewsLetterRepository],
  exports: [NewslettersService, NewsLetterRepository],
})
export class NewslettersModule {}
