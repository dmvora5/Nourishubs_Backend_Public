import { ALLOWEDTYPE, BasicQueryDto, getPaginationDetails, MAXFILESIZE, REQUEST_USER_TYPE } from '@app/common';
import { CommonResponseService, UploadService } from '@app/common/services';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { I18nContext } from 'nestjs-i18n';
import { KidsRepository } from 'src/modules/kids/kids.repository';
import { RequestDto, UpdateSchoolDto } from './dtos/school-admin.dto';
import { UserNotificationRepository } from '../../usernotification/usernotification.repository';
import { ParentRepository, SchoolRepository } from '../../users/user.repository';
import { VerificationRequestsService } from 'src/modules/verification-requests/verification-requests.service';

@Injectable()
export class SchoolAdminDashboardService {

    constructor(
        private readonly schoolRepository: SchoolRepository,
        private readonly parentRepository: ParentRepository,
        private readonly kidsRepository: KidsRepository,
        private readonly userNotificationReposuiService: UserNotificationRepository,
        private readonly verificationRequestService: VerificationRequestsService,
        private readonly responseService: CommonResponseService,
        private readonly uploadService: UploadService,
    ) { }

    async getParentsRequest(
        schoolAdminId: string,
        query: BasicQueryDto,
        i18n: I18nContext,
    ) {
        const {
            page = 1,
            limit = 10,
            searchQuery,
            orderBy = { createdAt: -1 },
        } = query;

        const skip = (page - 1) * limit;

        const searchFilter = searchQuery
            ? {
                $or: [
                    {
                        'parentDetails.first_name': {
                            $regex: searchQuery,
                            $options: 'i',
                        },
                    },
                    {
                        'parentDetails.last_name': { $regex: searchQuery, $options: 'i' },
                    },
                    { first_name: { $regex: searchQuery, $options: 'i' } },
                    { last_name: { $regex: searchQuery, $options: 'i' } },
                    { address: { $regex: searchQuery, $options: 'i' } },
                ],
            }
            : {};

        const result = await this.kidsRepository.aggregate([
            {
                $match: {
                    schoolId: mongoose.Types.ObjectId.createFromHexString(schoolAdminId),
                    verificationStatus: 'pending',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'parentId',
                    foreignField: '_id',
                    as: 'parentDetails',
                },
            },
            { $unwind: '$parentDetails' },
            { $match: searchFilter },
            {
                $facet: {
                    result: [
                        { $skip: skip },
                        { $limit: +limit },
                        {
                            $project: {
                                _id: 1,
                                kidName: { $concat: ['$first_name', ' ', '$last_name'] },
                                requestDate: '$createdAt',
                                address: 1,
                                parentDetails: {
                                    _id: 1,
                                    name: {
                                        $concat: [
                                            '$parentDetails.first_name',
                                            ' ',
                                            '$parentDetails.last_name',
                                        ],
                                    },
                                    email: '$parentDetails.email',
                                    phone: '$parentDetails.phone',
                                },
                                verificationStatus: 1,
                            },
                        },
                    ],
                    totalCount: [{ $count: 'total' }],
                },
            },
            {
                $project: {
                    result: 1,
                    totalCount: { $arrayElemAt: ['$totalCount.total', 0] },
                },
            },
        ]);


        const totalFiltered = result.length > 0 ? result[0].totalCount : 0;
        const responseResult = result.length > 0 ? result[0].result : [];

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
            getPaginationDetails({
                data: responseResult,
                count: totalFiltered,
                limit,
                skip,
            });

        const meta = {
            totalFiltered,
            total: totalFiltered,
            currentPage: page,
            perPage: limit,
            totalPage,
            startIndex,
            endIndex,
            currentPageFilteredCount,
            searchQuery,
        };

        return this.responseService.success(
            await i18n.translate('messages.parentReqFetch'),
            { response: responseResult },
            meta,
        );
    }

    async handleRequest(payload: RequestDto, i18n: I18nContext) {


        const [kid, parent] = await Promise.all([
            await this.kidsRepository.findById(payload.kidId),
            await this.parentRepository.findById(payload.parentId)
        ])

        if (!kid || kid?.parentId?.toString() !== parent?._id?.toString()) {
            throw new NotFoundException(await i18n.translate('messages.kidNotFound'));
        }

        await this.kidsRepository.findByIdAndUpdate(payload.kidId, {
            verificationStatus: payload.verificationStatus,
            rejectReason: payload?.rejectReason,
        });

        if (payload.verificationStatus == 'approved') {
            const approvedKids = parent.approvedKids;
            approvedKids.push(kid._id?.toString());
            parent.approvedKids = Array.from(new Set(approvedKids.map(ele => ele?.toString())));
            await parent.save();
        }

        await this.userNotificationReposuiService.create({
            userId: payload.parentId,
            childId: kid._id,
            title:
                payload.verificationStatus == 'approved'
                    ? 'Request Approved'
                    : 'Request Rejected',
            reason: payload.rejectReason,
        });
        let msg =
            payload.verificationStatus == 'approved'
                ? 'Request Approved'
                : 'Request Rejected';
        return this.responseService.success(
            await i18n.translate(msg + ' Successfully'),
            null,
        );
    }

    async updateSchoolAdmin(
        id: string,
        payload: UpdateSchoolDto,
        file: Express.Multer.File,
        i18n: I18nContext,
    ) {
        const { file: _file, email, ...userData } = payload;
        console.log(userData);

        const user = await this.schoolRepository.findById(id);
        if (!user) {
            throw new NotFoundException(
                await i18n.translate('messages.userNotFound'),
            );
        }
        if (email && email !== user.email) {
            const emailExist = await this.schoolRepository.findOne({ email });
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
                'school-admin-profile',
                i18n,
            );
            if (user.profileImage) {
                await this.uploadService.deleteFile(user.profileImage, i18n); // Ensure deleteImage method exists
            }
            user.profileImage = newImageLocation;
        }

        Object.assign(user, userData);

        if (email) {
            user.email = email; // Update email if provided
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

    async uploadDocument(
        id: string,
        url: string,
        docType: string,
        i18n: I18nContext,
    ) {
        const user = await this.schoolRepository.findById(id);
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

        await this.verificationRequestService.generateDocumentRequest(id, doc, REQUEST_USER_TYPE.SCHOOL);

        return this.responseService.success(
            await i18n.translate('messages.userUpdated'),
            result,
            {},
        );
    }

    async deleteDocument(id: string, docType: string, i18n: I18nContext) {
        const user = await this.schoolRepository.findById(id);
        const schoolRequests = await this.verificationRequestService.getDocumentRequestsByUserId(id);

        if (!user) {
            throw new NotFoundException(
                await i18n.translate('messages.userNotFound'),
            );
        }

        if (!user.documents) {
            throw new NotFoundException(
                await i18n.translate('messages.noDocumentsFound'),
            );
        }

        if (!schoolRequests || schoolRequests.length === 0) {
            throw new NotFoundException(
                await i18n.translate('messages.schoolRequestNotFound'),
            );
        }

        const schoolRequest = schoolRequests[0]; // Assuming you need the first request
        console.log('user.documents====>', user.documents);
        console.log('schoolRequest.documents====>', schoolRequest?.documents);

        let docUrl: string;

        // Handle user documents
        if (user.documents instanceof Map) {
            if (!user.documents.has(docType)) {
                throw new NotFoundException(
                    await i18n.translate('messages.documentNotFound'),
                );
            }
            docUrl = user.documents.get(docType);
            user.documents.delete(docType);
        } else {
            throw new Error(await i18n.translate('messages.fieldNotMap'));
        }

        // Handle schoolRequest documents
        if (schoolRequest.documents instanceof Map) {
            if (!schoolRequest.documents.has(docType)) {
                throw new NotFoundException(
                    await i18n.translate('messages.schoolRequestDocumentNotFound'),
                );
            }
            schoolRequest.documents.delete(docType);
        } else if (
            typeof schoolRequest.documents === 'object' &&
            docType in schoolRequest.documents
        ) {
            // Handle plain object documents
            delete schoolRequest.documents[docType];
        } else {
            throw new Error(
                await i18n.translate('messages.schoolRequestFieldNotMap'),
            );
        }

        // Save updated documents
        user.markModified('documents');
        schoolRequest.markModified('documents');

        const updatedUser = await user.save();
        const updatedSchoolRequest = await schoolRequest.save();

        try {
            // Delete the document from S3
            await this.uploadService.deleteDocument(docUrl, 'documents', i18n);
        } catch (error) {
            console.error('Error deleting document from S3:', error);
            throw new Error(
                await i18n.translate('messages.s3DocumentDeletionFailed'),
            );
        }

        const result = {
            userData: updatedUser,
            schoolRequestData: updatedSchoolRequest,
        };

        return this.responseService.success(
            await i18n.translate('messages.documentDeleted'),
            result,
            {},
        );
    }

    async updateProfileImage(id: string, url: string, i18n: I18nContext) {
        const user = await this.schoolRepository.findById(id);
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
}
