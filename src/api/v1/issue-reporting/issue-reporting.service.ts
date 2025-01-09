import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIssueDto } from './dtos/issueReporting.dtos';
import { Types } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';
import { BasicQueryDto, getPaginationDetails, ROLES } from '@app/common';
import { IssueRepotingRepository } from './isuee-reporting.repository';
import { CommonResponseService } from '@app/common/services';
import { KidsRepository } from 'src/modules/kids/kids.repository';
import { OrdersRepository } from 'src/modules/orders/order.repository';
@Injectable()
export class IssueReportingService {
    constructor(
        private readonly responseService: CommonResponseService,
        private readonly issueRepository: IssueRepotingRepository,
        private readonly kidsRepository: KidsRepository,
        private readonly orderRepository: OrdersRepository,
    ) { }

    async createIssue(
        user: any,
        payload: CreateIssueDto,
        i18n: I18nContext,
    ) {
        try {
            const issueData = { ...payload, userId: user?._id, status: 'Pending' };
            const queryCondition: any = {
                userId: user?._id,
                issue_topic_slug: issueData.issue_topic_slug,
                date: issueData.date,
            };

            if (user?.role == ROLES.PARENT) {
                queryCondition.kidId = issueData.kidId;
            }
    
            // Check for existing issue
            const issueExit = await this.issueRepository.getExistingIssue(queryCondition);
            if (issueExit) {
                return this.responseService.success(
                    await i18n.translate('messages.issueExit'),
                );
            }
            const createIssue = await this.issueRepository.create(issueData);
            return this.responseService.success(
                await i18n.translate('messages.issueCreate'),
                createIssue,
                {},
            );
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException(
                    await i18n.translate('messages.issueExit'),
                );
            }
            throw error;
        }
    }

    async getIssueById(id: string, i18n: I18nContext) {
        try {
            // Find kid by ID
            let issueById = await this.issueRepository.findById(id);

            if (!issueById) {
                throw new NotFoundException(
                    await i18n.translate('messages.issueNotFound'),
                );
            }
            const result = {
                issueData: issueById,
            };
            return this.responseService.success(
                await i18n.translate('messages.issueFetch'),
                result,
                {},
            );
        } catch (error) {
            throw error;
        }
    }

    async getIssueList(
        query: BasicQueryDto,
        userId : string,
        i18n: I18nContext
    ) {

        const { page = 1, limit = 10, searchQuery, orderBy = { createdAt: -1 } } = query;
        const skip = (page - 1) * limit;
        const searchFilter = searchQuery
            ? {
                $or: [
                    { issue_topic: { $regex: searchQuery, $options: 'i' } },
                ],
            }
            : {};

        const filter = { ...searchFilter , userId : userId };

        const [issues, total, totalFiltered] = await Promise.all([
            this.issueRepository
                .findWithPagination(filter , {skip, limit, orderBy}),
            this.issueRepository.countDocuments({}),
            this.issueRepository.countDocuments(filter),
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
            await i18n.translate('messages.issueFetch'),
            { issues },
            meta,
        );
    }

    async getKidList(parentId: string, i18n: I18nContext) {
        try {
            let kid = await this.kidsRepository.getKidsByParentId(parentId);

            if (!kid) {
                throw new NotFoundException(
                    await i18n.translate('messages.kidNotFound'),
                );
            }
            const result = {
                kidData: kid,
            };
            return this.responseService.success(
                await i18n.translate('messages.kidRetrieved'),
                result,
                {},
            );
        } catch (error) {
            throw error;
        }
    }

    async getStaticIssues(i18n: I18nContext) {
        try {
            let staticIssues = [
                { id: 1, name: "Issues with my live order", slug: "issues-with-my-live-order" },
                { id: 2, name: "Order never arrived", slug: "order-never-arrived" },
                { id: 3, name: "Wrong item/s received", slug: "wrong-item-s-received" },
                { id: 4, name: "Missing item/s", slug: "missing-item-s" },
                { id: 5, name: "Food damage or quality issue", slug: "food-damage-or-quality-issue" },
                { id: 6, name: "Payment issue", slug: "payment-issue" },
                { id: 7, name: "Technical issue while using the application", slug: "technical-issue-while-using-the-application" }
            ];
            
            const result = {
                issueData: staticIssues,
            };
            return this.responseService.success(
                await i18n.translate('messages.staticIssuesRetrieved'),
                result,
                {},
            );
        } catch (error) {
            throw error;
        }
    }

    async getAvailableDates(kidId: string, i18n: I18nContext) {
        try {
            let orders = await this.orderRepository.getOrdersForKid(kidId);

            if (!orders.status) {
                throw new NotFoundException(
                    await i18n.translate('messages.orderNotFound'),
                );
            }
            
            const orderDetails = orders.data.map(order => ({
                orderDate: order.orderDate,  
                vendorId: order.vendorId._id,    
            }));
    
            const result = {
                orderData: orderDetails,  
            };
    
            return this.responseService.success(
                await i18n.translate('messages.orderRetrieved'),
                result,
                {},
            );
        } catch (error) {
            throw error;
        }
    }

    async getAvailableDatesForStaff(id: string, i18n: I18nContext) {
        try {
            let orders = await this.orderRepository.getOrdersForStaff(id);

            if (!orders.status) {
                throw new NotFoundException(
                    await i18n.translate('messages.orderNotFound'),
                );
            }
            
            const orderDetails = orders.data.map(order => ({
                orderDate: order.orderDate,  
                vendorId: order.vendorId._id,    
            }));
    
            const result = {
                orderData: orderDetails,  
            };
    
            return this.responseService.success(
                await i18n.translate('messages.orderRetrieved'),
                result,
                {},
            );
        } catch (error) {
            throw error;
        }
    }

    async getTotalIssueCount(id: string, i18n: I18nContext) {
        try {
            // Find kid by ID
            let count = await this.issueRepository.countIssues(id);
          
            const result = {
                countIssues: count,
            };
            return this.responseService.success(
                await i18n.translate('messages.issueCountFetch'),
                result,
                {},
            );
        } catch (error) {
            throw error;
        }
    }
}
