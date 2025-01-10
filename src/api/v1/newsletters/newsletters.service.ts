import { CommonResponseService } from '@app/common/services';
import { Injectable } from '@nestjs/common';
import { NewsLetterRepository } from './newsletters.repository';
import { CreateNewsLetterDto } from './dtos/create-newsletter.dto';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class NewslettersService {

    constructor(
        private readonly responseService: CommonResponseService,
        private readonly newslettersRepository: NewsLetterRepository,
    ) { }

    async create(createNewsLetterDto: CreateNewsLetterDto, i18n: I18nContext) {
        const { ...userData } = createNewsLetterDto;

        const emailExist = (await this.newslettersRepository.findOne({ email: userData.email }))?.toObject();
        if (emailExist) {
            return this.responseService.success(await i18n.translate('messages.newsletterSubscribed'));

        }
        userData.isSubscribed = true;
        console.log(userData);
        const contactUs = await this.newslettersRepository.create(userData);
        return this.responseService.success(await i18n.translate('messages.newsletter'), contactUs);
    }
}
