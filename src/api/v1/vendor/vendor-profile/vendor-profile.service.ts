import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { VendorRepository } from '../../users/user.repository';
import { VENDOR_REQUEST_STATUS, VENDOR_VERIFICATION_TYPE } from '@app/common';
import { DocumentRequestDto, ThressHoldRequestDto, UpdateVendorDto } from './dtos/vendor.dtos';
import { I18nContext } from 'nestjs-i18n';
import { CommonResponseService } from '@app/common/services';
import { VendorRequestsRepository } from './vendor-request.repository';

@Injectable()
export class VendorProfileService {

    constructor(
        private readonly userRepository: VendorRepository,
        private readonly vendorRequestRepository: VendorRequestsRepository,
        private readonly responseService: CommonResponseService,
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

        this.generateDocumentRequest(id, doc, i18n);
        return this.responseService.success(
            await i18n.translate('messages.userUpdated'),
            result,
            {},
        );

    }

    async generateThresholdrequest(
        vendorId: string,
        payload: ThressHoldRequestDto,
        i18n: I18nContext,
    ) {
        await this.vendorRequestRepository.findOneAndUpdate(
            {
                vendorId: vendorId,
                requestStatus: VENDOR_REQUEST_STATUS.OPEN,
                type: VENDOR_VERIFICATION_TYPE.THRESHOLD
            },
            {
                minThresHold: payload.minThresHold,
                vendorId: vendorId,
                type: VENDOR_VERIFICATION_TYPE.THRESHOLD,
                requestStatus: VENDOR_REQUEST_STATUS.OPEN,
            },
        );

        return this.responseService.success(
            await i18n.translate('messages.userUpdated'),
            null,
            {},
        );
    }

    async generateDocumentRequest(
        vendorId: string,
        payload: DocumentRequestDto,
        i18n: I18nContext,
    ) {
        await this.vendorRequestRepository.findOneAndUpdate(
            {
                vendorId: vendorId,
                requestStatus: VENDOR_REQUEST_STATUS.OPEN,
                type: VENDOR_VERIFICATION_TYPE.DOCUMENTVERIFICATION,
            },
            {
                vendorId,
                ...payload,
                type: VENDOR_VERIFICATION_TYPE.DOCUMENTVERIFICATION,
                requestStatus: VENDOR_REQUEST_STATUS.OPEN,
            }
        );

        return this.responseService.success(
            await i18n.translate('messages.userUpdated'),
            null,
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
