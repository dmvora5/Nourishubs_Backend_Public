import {
    BasicQueryDto,
    getPaginationDetails,
} from '@app/common';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ModifierRepository } from './modifier.repository';
import { ModifierDto } from './dtos/modifier.dtos';
import { I18nContext } from 'nestjs-i18n';
import { CommonResponseService } from '@app/common/services';

@Injectable()
export class ModifierService {
    constructor(
        private readonly responseService: CommonResponseService,
        private readonly modifierRepository: ModifierRepository,
    ) { }

    async createModifier(
        vendor: string,
        modifierDto: ModifierDto,
        i18n: I18nContext,
    ) {
        const { ...data } = modifierDto;

        const dish = (
            await this.modifierRepository.findOne({ name: data.name })
        )?.toObject();

        if (dish) {
            throw new UnprocessableEntityException(
                await i18n.translate('messages.modifierExist'),
            );
        }
        data.vendor = vendor;
        const newModifier = await this.modifierRepository.create(data);

        return this.responseService.success(
            await i18n.translate('messages.modifierGroupCreated'),
            newModifier,
            null,
        );
    }

    async updateModifier(
        vendorId: string,
        id: string,
        modifierDto: Partial<ModifierDto>, // Use Partial to allow updating only some fields
        i18n: I18nContext,
    ) {
        // Find the modifier by its ID
        const modifier = await this.modifierRepository.findOne({
            _id: id,
            vendor: vendorId,
        });

        if (!modifier) {
            throw new NotFoundException(
                await i18n.translate('messages.modifierNotFound'),
            );
        }

        // Check for a duplicate modifier name, excluding the current modifier
        if (modifierDto.name) {
            const existingModifier = await this.modifierRepository.findOne({
                name: modifierDto.name,
                _id: { $ne: id },
                vendor: vendorId,
            });

            if (existingModifier) {
                throw new UnprocessableEntityException(
                    await i18n.translate('messages.modifierExists'),
                );
            }
        }

        // Update fields in the modifier document
        Object.assign(modifier, modifierDto);

        // Save the updated modifier
        await modifier.save();

        return this.responseService.success(
            await i18n.translate('messages.modifierGroupUpdated'),
            modifier,
            null,
        );
    }

    async getAllModifiers(
        queryData: BasicQueryDto,
        i18n: I18nContext,
        baseFilter = {},
    ) {
        const {
            page = 1,
            limit = 10,
            searchQuery,
            orderBy = { createdAt: -1 },
        } = queryData;

        const skip = (page - 1) * limit;
        const searchFilter = searchQuery
            ? { name: { $regex: searchQuery, $options: 'i' } }
            : {};

        const filter = { ...baseFilter, ...searchFilter, status: 'active' };

        const [modifiers, total, totalFiltered] = await Promise.all([
            this.modifierRepository.getAllModifierWithPagination({
                filter,
                skip,
                limit,
                orderBy,
            }),
            this.modifierRepository.countDocuments({}),
            this.modifierRepository.countDocuments(filter),
        ]);

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
            getPaginationDetails({
                data: modifiers,
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

        const users = {
            modifiers: modifiers,
        };
        return this.responseService.success(
            await i18n.translate('messages.modifierRetrieved'),
            users,
            meta,
        );
    }

    async getModifierById(id: string, i18n: I18nContext) {
        const modifier =
            await this.modifierRepository.getModifierWithDishesById(id);

        if (!modifier || modifier?.status === 'deleted') {
            throw new BadRequestException(
                i18n.translate('messages.modifierNotFound'),
            );
        }

        return this.responseService.success(
            await i18n.translate('messages.modifierRetrieved'),
            modifier,
            null,
        );
    }

    async deleteModifier(id: string, vendor: string, i18n: I18nContext) {
        const dishData = await this.modifierRepository.findOne({
            _id: id,
            vendor: vendor,
        });
        if (!dishData) {
            throw new BadRequestException(i18n.translate('messages.dishNotFound'));
        }
        await this.modifierRepository.findByIdAndUpdate(dishData._id?.toString(), {
            status: 'deleted'
        });
        return this.responseService.success(
            await i18n.translate('messages.dishDeleted'),
            dishData,
            null,
        );
    }
}
