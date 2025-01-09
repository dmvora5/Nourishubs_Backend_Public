import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IssueRepotingRepository } from '../issue-reporting/isuee-reporting.repository';
import { DisputeResolutionRepository } from './dispute-resolution.repository';
import { UserRepository } from '../users/user.repository';
import {
  BasicQueryDto,
  getPaginationDetails,
} from '@app/common';
import { I18nContext } from 'nestjs-i18n';
import {
  CreateDisputeDto,
  ResponseDisputeDto,
} from './dtos/disputeResolution.dtos';
import { CommonResponseService } from '@app/common/services';

@Injectable()
export class DisputeResolutionService {
  constructor(
    private readonly issuereportingRepository: IssueRepotingRepository,
    private readonly disputeResolutionRepository: DisputeResolutionRepository,
    private readonly userRepository: UserRepository,
    private readonly responseService: CommonResponseService,
  ) {}

  async getDisputeList(query: BasicQueryDto, i18n: I18nContext) {
    const {
      page = 1,
      limit = 10,
      searchQuery,
      orderBy = { createdAt: -1 },
    } = query;

    const skip = (page - 1) * limit;

    const searchFilter = searchQuery
      ? {
          $or: [{ schoolName: { $regex: searchQuery, $options: 'i' } }],
        }
      : {};

    const filter = { ...searchFilter };

    const [issues, total, totalFiltered] = await Promise.all([
      this.disputeResolutionRepository.findWithPagination(filter, {
        skip,
        limit,
        orderBy,
      }),
      this.disputeResolutionRepository.countDocuments({}),
      this.disputeResolutionRepository.countDocuments(filter),
    ]);

    const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
      getPaginationDetails({
        data: issues,
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
      await i18n.translate('messages.disputFetch'),
      { issues },
      meta,
    );
  }

  async createDispute(payload: CreateDisputeDto, i18n: I18nContext) {
    try {
      const userData = { ...payload, status: 'Pending' };
      const vendorId = userData.vendorId.toString();

      const dispute = await this.disputeResolutionRepository.findOneDispute(
        userData.orderDate,
        vendorId,
      );

      if (dispute) {
        return this.responseService.success(
          await i18n.translate('messages.disputeExit'),
        );
      }

      const disputeData =
        await this.disputeResolutionRepository.create(userData);
      return this.responseService.success(
        await i18n.translate('messages.disputeCreate'),
        disputeData,
        {},
      );
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          await i18n.translate('messages.disputeExit'),
        );
      }
      throw error;
    }
  }

  async getDisputeById(id: string, i18n: I18nContext) {
    try {
      // Find kid by ID
      let dispute = await this.disputeResolutionRepository.findById(id);

      if (!dispute) {
        throw new NotFoundException(
          await i18n.translate('messages.disputeNotFound'),
        );
      }
      const result = {
        disputeData: dispute,
      };
      return this.responseService.success(
        await i18n.translate('messages.disputeFetch'),
        result,
        {},
      );
    } catch (error) {
      throw error;
    }
  }

  async responseDispute(
    id: string,
    payload: ResponseDisputeDto,
    i18n: I18nContext,
  ) {
    try {
      const dispute = await this.disputeResolutionRepository.findById(id);

      if (!dispute) {
        throw new NotFoundException(
          await i18n.translate('messages.disputeNotFound'),
        );
      }
      const issueId = dispute.issueId.toString();

      const issue = await this.issuereportingRepository.findById(issueId);

      if (!issue) {
        throw new NotFoundException(
          await i18n.translate('messages.issueNotFound'),
        );
      }

      issue.status = 'Resolved';
      issue.response = payload.response;
      await issue.save();

      dispute.status = 'Resolved';
      dispute.response = payload.response;
      await dispute.save();

      const result = {
        data: {
          dispute,
          issue,
        },
      };

      return this.responseService.success(
        await i18n.translate('messages.disputeProcessed'),
        result,
        {},
      );
    } catch (error) {
      // Improved error handling
      if (!(error instanceof NotFoundException)) {
        console.error('Error processing dispute:', error);
      }
      throw error;
    }
  }
}
