import { ALLOWEDTYPE, BasicQueryDto, getPaginationDetails, MAXFILESIZE } from '@app/common';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DishDto } from './dtos/dish.dtos';
import { I18nContext } from 'nestjs-i18n';
import { DishRepository } from './dish.repository';
import { UpdateDishDto } from './dtos/update-dish.dtos';
import { DishesResponseDto } from './dtos/dish.response.dto';
import { CommonResponseService, UploadService } from '@app/common/services';

@Injectable()
export class DishService {

    constructor(
        private readonly responseService: CommonResponseService,
        private readonly uploadService: UploadService,
        private readonly dishRepository: DishRepository
    ) { }

    async createDish(
        vendor: string,
        dishDto: DishDto,
        file: Express.Multer.File,
        i18n: I18nContext,
    ) {
        const { file: _file, ...userData } = dishDto;

        let location = '';


        const dish = (await this.dishRepository.findOne({ name: userData.name }))?.toObject();

        if (dish) {
            throw new ConflictException(await i18n.translate('messages.dishExists'));
        }

        if (file) {
            if (!ALLOWEDTYPE.includes(file.mimetype)) {
                throw new BadRequestException(
                    await i18n.translate('messages.fileVelidation'),
                );
            }

            if (file.size > MAXFILESIZE) {
                throw new BadRequestException(await i18n.translate('messages.fileSize'));
            }

            location = await this.uploadService.uploadImage(
                file,
                'dish-images',
                i18n,
            );

        }


        userData.vendor = vendor;

        const newDish = await this.dishRepository.create({
            ...userData,
            image: location,
        });

        return this.responseService.success(
            await i18n.translate('messages.dishCreated'),
            newDish,
            null,
        );
    }

    async editDish(
        vendorId: string,
        id: string,
        updateDishDto: Partial<UpdateDishDto>,
        file: Express.Multer.File | null,
        i18n: I18nContext,
    ) {
        const existingDish = await this.dishRepository.findOne({ _id: id, vendor: vendorId });

        const { file: _file, ...dishDto } = updateDishDto;

        if (!existingDish) {
            throw new NotFoundException(
                await i18n.translate('messages.dishNotFound'),
            );
        }

        if (dishDto.name && dishDto.name !== existingDish.name) {
            const duplicateDish = await this.dishRepository
                .findOne({ name: dishDto.name, vendor: vendorId })
            if (duplicateDish) {
                throw new ConflictException(
                    await i18n.translate('messages.dishExists'),
                );
            }
        }

        // Handle file upload if a file is provided
        if (file) {
            if (!ALLOWEDTYPE.includes(file.mimetype)) {
                throw new BadRequestException(i18n.t('messages.fileVelidation'));
            }

            if (file.size > MAXFILESIZE) {
                throw new BadRequestException(i18n.t('messages.fileSize'));
            }

            // Upload new image and delete old image if exists
            const newImageLocation = await this.uploadService.uploadImage(
                file,
                'dish-images',
                i18n,
            );
            if (existingDish.image) {
                await this.uploadService.deleteFile(existingDish.image, i18n); // Ensure deleteImage method exists
            }

            existingDish.image = newImageLocation;
        }

        // Update dish details
        for (const key in dishDto) {
            if (Object.prototype.hasOwnProperty.call(dishDto, key)) {
                existingDish[key] = dishDto[key];
            }
        }

        await existingDish.save();

        return this.responseService.success(
            await i18n.translate('messages.dishUpdated'),
            existingDish,
            null,
        );
    }

    async getAllDishes(
        queryData: BasicQueryDto,
        i18n: I18nContext,
        baseFilter = {}

    ) {

        const { page = 1, limit = 10, searchQuery, orderBy = { createdAt: -1 } } = queryData;

        const skip = (page - 1) * limit;
        const searchFilter = searchQuery
            ? { name: { $regex: searchQuery, $options: 'i' } }
            : {};

        const filter = { ...baseFilter, ...searchFilter , status: 'active' };

        const [dishes, total, totalFiltered] = await Promise.all([
            this.dishRepository.getAllDishisesWithPaginations({ filter, skip, limit, orderBy }),
            this.dishRepository.countDocuments({}),
            this.dishRepository.countDocuments(filter),
        ]);

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
            getPaginationDetails({
                data: dishes,
                count: totalFiltered,
                limit,
                skip,
            });

        const meta = {
            totalFiltered,
            total,
            currentPage: page,
            perPage: limit,
            totalPage,
            startIndex,
            endIndex,
            currentPageFilteredCount,
            searchQuery,
            orderBy,
        };

        // const response = Serialize(DishesResponseDto, dishes);

        const users = {
            dishes: dishes,
        };
        return this.responseService.success(
            await i18n.translate('messages.usersRetrieved'),
            users,
            meta,
        );
    }
    async getDishById(id: string, i18n: I18nContext) {
        const dish = await this.dishRepository.findById(id);
        if (!dish || dish?.status === 'deleted') {
            throw new BadRequestException(i18n.translate('messages.dishNotFound'));
        }
        return this.responseService.success(await i18n.translate('messages.dishRetrieved'), dish, null);
    }

    async deleteDish(id: string, vendor: string, i18n: I18nContext) {

        const dishData = await this.dishRepository.findOne({ _id: id, vendor: vendor });

        if (!dishData) {
            throw new BadRequestException(i18n.translate('messages.dishNotFound'));
        }

        // if (dishData.image) {
        //     try {
        //         await this.uploadService.deleteFile(dishData.image, i18n);
        //     } catch (err) {
        //         console.log('err', err)
        //     }
        // }
        // await this.dishRepository.findByIdAndDelete(dishData._id as string);
        await this.dishRepository.findByIdAndUpdate(dishData._id?.toString(), {
            status: 'deleted'
        });
        return this.responseService.success(await i18n.translate('messages.dishDeleted'), dishData, null);
    }

}
