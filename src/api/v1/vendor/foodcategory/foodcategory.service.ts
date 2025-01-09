import {
  ALLOWEDTYPE,
  BasicQueryDto,
  getPaginationDetails,
  MAXFILESIZE,
} from '@app/common';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FoodCategoryRepository } from './foodcategory.repository';
import { I18nContext } from 'nestjs-i18n';
import { CommonResponseService, UploadService } from '@app/common/services';

@Injectable()
export class FoodcategoryService {
  constructor(
    private readonly responseService: CommonResponseService,
    private readonly uploadService: UploadService,
    private readonly foodCategoryRepository: FoodCategoryRepository,
  ) {}

  async createCategory(
    id: string,
    name: string,
    file: Express.Multer.File,
    i18n: I18nContext,
  ) {
    const category = (
      await this.foodCategoryRepository.findOne({ name, vendor: id })
    )?.toObject();

    if (category && category?.status === 'deleted') {
      await this.foodCategoryRepository.findByIdAndUpdate(category?._id, {
        status: 'active',
      });

      return this.responseService.success(
        await i18n.translate('messages.categoryCreated'),
        category,
        null,
      );
    }

    if (category) {
      throw new UnprocessableEntityException(
        await i18n.translate('messages.categoryExists'),
      );
    }

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
      'foodCategory-images',
      i18n,
    );

    const newCategory = this.foodCategoryRepository.create({
      name,
      imageUrl: Location,
      vendor: id,
    });

    return this.responseService.success(
      await i18n.translate('messages.categoryCreated'),
      newCategory,
      null,
    );
  }

  async getAllCategories(
    vendorId: string,
    query: BasicQueryDto,
    i18n: I18nContext,
  ) {
    const { page = 1, limit = 10, searchQuery } = query;

    const skip = (page - 1) * limit;
    const commonFilter = { vendor: vendorId, status: 'active' };

    const filter = searchQuery
      ? { name: { $regex: searchQuery, $options: 'i' } }
      : {};

    const [categories, total, totalFiltered] = await Promise.all([
      this.foodCategoryRepository.findWithPagination(
        { ...commonFilter, ...filter },
        { skip, limit },
        '-status',
      ),
      this.foodCategoryRepository.countDocuments(commonFilter),
      this.foodCategoryRepository.countDocuments({
        ...commonFilter,
        ...filter,
      }),
    ]);

    const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
      getPaginationDetails({
        data: categories,
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
    };
    return this.responseService.success(
      await i18n.translate('messages.categoryRetrieved'),
      { categories },
      meta,
    );
  }

  async updateCatgory(
    id: string,
    name: string,
    i18n: I18nContext,
    file?: Express.Multer.File,
  ) {
    const category = await this.foodCategoryRepository.findById(id);

    if (!category || category?.status === 'deleted') {
      throw new BadRequestException(
        await i18n.translate('messages.categoryNotFound'),
      );
    }

    const conflictNameExist = await this.foodCategoryRepository.findOne({
      _id: { $ne: id },
      name,
    });

    if (conflictNameExist) {
      throw new ConflictException(
        await i18n.translate('messages.categoryNameExists'),
      );
    }

    if (file) {
      await this.uploadService.deleteFile(category.imageUrl, i18n);

      if (!ALLOWEDTYPE.includes(file.mimetype)) {
        throw new BadRequestException(
          i18n.translate('messages.fileVelidation'),
        );
      }

      if (file.size > MAXFILESIZE) {
        throw new BadRequestException(i18n.translate('messages.fileSize'));
      }

      const Location = await this.uploadService.uploadImage(
        file,
        'foodCategory-images',
        i18n,
      );

      category.imageUrl = Location;
    }

    category.name = name;

    await category.save();

    return this.responseService.success(
      await i18n.translate('messages.categoryUpdated'),
      category,
      null,
    );
  }

  async getCatogeryById(id: string, i18n: I18nContext) {
    const category = (
      await this.foodCategoryRepository.findById(id)
    )?.toObject();

    if (!category || category?.status === 'deleted') {
      throw new BadRequestException(
        i18n.translate('messages.categoryNotFound'),
      );
    }

    return this.responseService.success(
      await i18n.translate('messages.categoryRetrieved'),
      category,
      null,
    );
  }

  async deleteCategory(id: string, vendor: string, i18n: I18nContext) {
    const category = await this.foodCategoryRepository.findOne({
      _id: id,
      vendor: vendor,
    });

    if (!category) {
      throw new BadRequestException(
        i18n.translate('messages.categoryNotFound'),
      );
    }

    // if (category.imageUrl) {
    //     try {
    //         await this.uploadService.deleteFile(category.imageUrl, i18n);
    //     } catch (err) {
    //         console.log('err', err)
    //     }
    // }

    await this.foodCategoryRepository.findByIdAndUpdate(
      category._id?.toString(),
      {
        status: 'deleted',
      },
    );
    return this.responseService.success(
      await i18n.translate('messages.categoryDeleted'),
      category,
      null,
    );
  }
}
