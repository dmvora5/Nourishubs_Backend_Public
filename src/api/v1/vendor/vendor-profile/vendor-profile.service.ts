import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { VendorRepository } from '../../users/user.repository';
import { UpdateVendorDto } from './dtos/vendor.dtos';
import { I18nContext } from 'nestjs-i18n';
import { CommonResponseService } from '@app/common/services';
import { VerificationRequestsService } from 'src/modules/verification-requests/verification-requests.service';
import { REQUEST_USER_TYPE } from '@app/common';

@Injectable()
export class VendorProfileService {

    constructor(
        private readonly userRepository: VendorRepository,
        private readonly responseService: CommonResponseService,
        private readonly verificationRequestService: VerificationRequestsService
    ) { }


    async updateVendor(id: string, payload: UpdateVendorDto, i18n: I18nContext) {
        const { email, ...userData } = payload;
        console.log(userData);
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(
                await i18n.translate('messages.userNotFound'),
            );
        }
        if (email && email !== user.email) {
            const emailExist = (await this.userRepository.findOne({ email }))?.toObject();
            if (emailExist) {
                throw new ConflictException(
                    await i18n.translate('messages.emailExists'),
                );
            }
        }

        Object.assign(user, userData);
        if (email) {
            user.email = email;
        }
        const updatedUser = await user.save();

        const result = {
            userData: updatedUser,
        };
        return this.responseService.success(
            await i18n.translate('messages.userUpdated'),
            result,
            {},
        );

    }

    async updateProfileImage(id: string, url: string, i18n: I18nContext) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(
                await i18n.translate('messages.userNotFound'),
            );
        }
        user.profileImage = url;

        const updatedUser = await user.save();
        console.log(updatedUser.profileImage);
        updatedUser.profileImage =
            process.env.S3_BASE_URL + 'profile-images/' + updatedUser.profileImage;
        const result = {
            userData: updatedUser,
        };
        return this.responseService.success(
            await i18n.translate('messages.userUpdated'),
            result,
            null,
        );
    }


    async uploadDocument(
        id: string,
        url: string,
        docType: string,
        i18n: I18nContext,
    ) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(
                await i18n.translate('messages.userNotFound'),
            );
        }

        if (!user.documents) {
            user.documents = new Map();
        }

        if (user.documents instanceof Map) {
            user.documents.set(docType, url);
        } else {
            throw new Error(i18n.translate('messages.fieldNotMap'));
        }

        user.markModified('documents');

        const updatedUser = await user.save();

        const result = {
            userData: updatedUser,
        };
        const doc = { documents: updatedUser.documents };

        await this.verificationRequestService.generateDocumentRequest(id, doc, REQUEST_USER_TYPE.VENDOR);

        return this.responseService.success(
            await i18n.translate('messages.userUpdated'),
            result,
            {},
        );

    }


    async getUserById(id: string, i18n: I18nContext) {
          const user = (await this.userRepository.findById(id))?.toObject();
    
          if (!user) {
            throw new NotFoundException(
              await i18n.translate('messages.userNotFound'),
            );
          }
          const result = {
            userData: user,
          };
          return this.responseService.success(
            await i18n.translate('messages.userRetrieved'),
            result,
            null,
          );
      }

}
