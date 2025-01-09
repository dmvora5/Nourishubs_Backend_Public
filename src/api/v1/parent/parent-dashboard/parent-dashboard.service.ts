import { CommonResponseService, UploadService } from '@app/common/services';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ParentRepository } from '../../users/user.repository';
import { UpdateParentDto } from './dtos/parent-dashboard.dtos';
import { I18nContext } from 'nestjs-i18n';
import { ALLOWEDTYPE, MAXFILESIZE } from '@app/common';

@Injectable()
export class ParentDashboardService {

    constructor(
        private readonly uploadService: UploadService,
        private readonly userRepository: ParentRepository,
        private readonly responseService: CommonResponseService
      ) { }
    
      async updateParent(
        id: string,
        payload: UpdateParentDto,
        file: Express.Multer.File,
        i18n: I18nContext,
      ) {
        const { email, file: _file, ...userData } = payload;
        console.log(userData);
    
        const user = await this.userRepository.findById(id);
        if (!user) {
          throw new NotFoundException(
            await i18n.translate('messages.userNotFound'),
          );
        }
        if (email && email !== user.email) {
          const emailExist = await this.userRepository.findOne({ email });
          if (emailExist) {
            throw new ConflictException(
              await i18n.translate('messages.emailExists'),
            );
          }
        }
        if (file) {
          if (!ALLOWEDTYPE.includes(file.mimetype)) {
            throw new BadRequestException(i18n.t('messages.fileVelidation'));
          }
    
          if (file.size > MAXFILESIZE) {
            throw new BadRequestException(i18n.t('messages.fileSize'));
          }
    
          const newImageLocation = await this.uploadService.uploadImage(
            file,
            'kids-profile',
            i18n
          );
          if (user.profileImage) {
            await this.uploadService.deleteFile(user.profileImage, i18n);
          }
          user.profileImage = newImageLocation;
        }
    
        Object.assign(user, userData);
    
        if (email) {
          user.email = email;
        }
        user.location = {
          latitude: payload.latitude,
          address: payload.address,
          longitude: payload.longitude,
          type: 'Point',
          coordinates: [payload.longitude, payload.latitude],
          state: payload.state,
          city: payload.city,
          district: payload.district,
          country: payload.country,
        };
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
    
      async getParentDetailsById(
        id: string,
        i18n: I18nContext,
      ) {
        const parent = (await this.userRepository.findById(id))?.toObject();
        if (!parent) {
          throw new NotFoundException(
            await i18n.translate('messages.userNotFound'),
          );
        }
        return this.responseService.success(await i18n.translate('messages.userRetrieved'), parent, {});
      }
}
