import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ParentRepository, UserRepository } from '../../api/v1/users/user.repository';
import { CreateKidsDto, UpdateKidsDto } from './dtos/kids-dashboards.dtos';
import { I18nContext } from 'nestjs-i18n';
import { ALLOWEDTYPE, BasicQueryDto, getPaginationDetails, MAXFILESIZE } from '@app/common';
import { CommonResponseService, UploadService } from '@app/common/services';
import { KidsRepository } from './kids.repository';

@Injectable()
export class KidService {


    constructor(
        private readonly kidRepository: KidsRepository,
        private readonly userRepository: UserRepository,
        private readonly parentRepository: ParentRepository,
        private readonly uploadService: UploadService,
        private readonly responseService: CommonResponseService,
    ) { }

    async getAllKids(parentId: string, query: BasicQueryDto, i18n: I18nContext) {
        const { page = 1, limit = 10, searchQuery } = query;

        const skip = (page - 1) * limit;

        const filter = searchQuery
            ? {
                $or: [
                    { first_name: { $regex: searchQuery, $options: 'i' } },
                    { last_name: { $regex: searchQuery, $options: 'i' } },
                    { schoolName: { $regex: searchQuery, $options: 'i' } },
                    {
                        age: !isNaN(Number(searchQuery))
                            ? Number(searchQuery)
                            : undefined,
                    },
                    { gender: { $regex: searchQuery, $options: 'i' } },
                ].filter(Boolean),
            }
            : {};

        const baseFilter = { parentId, ...filter };

        const [usersData, total, totalFiltered] = await Promise.all([
            this.kidRepository.getKidsWithParentAndSchoolDetails({
                filter: baseFilter,
                skip,
                limit,
            }),
            this.kidRepository.countDocuments({}),
            this.kidRepository.countDocuments(baseFilter),
        ]);

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
            getPaginationDetails({
                data: usersData,
                count: totalFiltered,
                limit,
                skip,
            });

        const meta = {
            totalFiltered: totalFiltered,
            total,
            currentPage: page,
            perPage: limit,
            totalPage,
            startIndex,
            endIndex,
            currentPageFilteredCount,
            searchQuery,
        };

        return this.responseService.success(
            await i18n.translate('messages.usersRetrieved'),
            { userData: usersData },
            meta,
        );
    }

    async createKid(
        payload: CreateKidsDto,
        file: Express.Multer.File,
        i18n: I18nContext,
        userId,
    ) {

        console.log('this.kid', this.kidRepository)
        const { file: _file, ...userData } = payload;
        console.log(userData);

        const user = (
            await this.userRepository.findOne({ _id: userId })
        )?.toObject();

        if (!user) {
            throw new NotFoundException(
                await i18n.translate('messages.userNotFound'),
            );
        }
        const kidExist = await this.kidRepository.findOne({
            parentId: userId,
            first_name: userData.first_name,
            last_name: userData.last_name,
        });
        if (kidExist) {
            throw new UnprocessableEntityException('messages.kidExits');
        }

        console.log('file', file);

        if (!file) {
            throw new BadRequestException(i18n.translate('messages.fileRequired'));
        }

        if (!ALLOWEDTYPE.includes(file.mimetype)) {
            throw new BadRequestException(i18n.translate('messages.fileVelidation'));
        }

        if (file.size > MAXFILESIZE) {
            throw new BadRequestException(i18n.translate('messages.fileSize'));
        }

        const Location = await this.uploadService.uploadImage(
            file,
            'kids-profile',
            i18n,
        );

        let kidData = {
            imageUrl: Location,
            location: {
                latitude: payload.latitude,
                address: payload.address,
                longitude: payload.longitude,
                type: 'Point',
                coordinates: [payload.longitude, payload.latitude],
                state: payload.state,
                city: payload.city,
                district: payload.district,
                country: payload.country,
            },
            ...userData,
            parentId: userId,
        };

        const kid = await this.kidRepository.create(kidData);

        const parent = await this.parentRepository.findById(userId);

        return this.responseService.success(
            await i18n.translate('messages.kidCreate'),
            kid,
            {},
        );
    }

    async updateKid(
        id: string,
        parentId: string,
        payload: UpdateKidsDto,
        file: Express.Multer.File,
        i18n: I18nContext,
    ) {
        const { file: _file, ...userData } = payload;

        const user = await this.kidRepository.findById(id);
        if (!user) {
            throw new NotFoundException(
                await i18n.translate('messages.userNotFound'),
            );
        }

        if (user.parentId?.toString() !== parentId) {
            throw new ForbiddenException("You are a not parent of this kid");
        }
        // Handle file upload if a file is provided
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
                i18n,
            );
            if (user.imageUrl) {
                await this.uploadService.deleteFile(user.imageUrl, i18n);
            }

            user.imageUrl = newImageLocation;
        }
        (user.location = {
            latitude: payload.latitude,
            address: payload.address,
            longitude: payload.longitude,
            type: 'Point',
            coordinates: [payload.longitude, payload.latitude],
            state: payload.state,
            city: payload.city,
            district: payload.district,
            country: payload.country,
        }),
            Object.assign(user, userData);
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

    async getKidById(parentId: string, id: string, i18n: I18nContext) {
        try {
            // Find kid by ID
            let kid = await this.kidRepository.getKisDetailsByIdWithParent(id);

            if (kid.parentId?.toString() !== parentId) {
                throw new ForbiddenException();
            }

            if (!kid) {
                throw new NotFoundException(
                    await i18n.translate('messages.userNotFound'),
                );
            }
            const result = {
                userData: kid,
            };
            return this.responseService.success(
                await i18n.translate('messages.userRetrieved'),
                result,
                {},
            );
        } catch (error) {
            throw error;
        }
    }

    async getKidsSchoolAddressById(
        parentId: string,
        id: string,
        i18n: I18nContext,
    ) {
        let kid = await this.kidRepository.getKidSchoolAddressById(id);

        if (!kid) {
            throw new NotFoundException(
                await i18n.translate('messages.userNotFound'),
            );
        }

        if (kid.parentId?.toString() !== parentId) {
            throw new ForbiddenException();
        }

        return kid;
    }

    async verifyKid(parentId: string, kid: any) {
        if (kid.parentId !== parentId || kid.verificationStatus !== 'approved') {
            throw new ForbiddenException();
        }
    }

    async findKidById(id: string) {
        return await this.kidRepository.findById(id);
    }

    async findAndVerifyKid(parentId: string, kidId: string, i18n: I18nContext) {
        const kid = (await this.kidRepository.findById(kidId))?.toObject();

        if (!kid)
            throw new NotFoundException(await i18n.translate('messages.kidNotFound'));

        if (
            kid.parentId?.toString() !== parentId ||
            kid.verificationStatus !== 'approved'
        ) {
            throw new ForbiddenException(
                await i18n.translate('messages.kidNotApprove'),
            );
        }
    }
}
