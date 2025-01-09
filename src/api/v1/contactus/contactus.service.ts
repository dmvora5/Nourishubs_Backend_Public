import {
  BasicQueryDto,
  getPaginationDetails,
  Serialize,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { CreateContactusDto } from './dto/create-contactus.dto';
import { I18nContext } from 'nestjs-i18n';
import { ContactUsRepository } from './contactus.repository';
import { QueryResponseDto } from './dto/query.response.dto';
import { CommonResponseService, EmailService } from '@app/common/services';

@Injectable()
export class ContactusService {
  constructor(
    private readonly contactusRepository: ContactUsRepository,
    private readonly responseService: CommonResponseService,
    private readonly emailService: EmailService,
  ) {}
  async create(createContactusDto: CreateContactusDto, i18n: I18nContext) {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You for Contacting Us</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f7fc;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
    
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                }
    
                .header {
                    background-color: #4CAF50;
                    padding: 10px;
                    color: white;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
    
                .content {
                    padding: 20px;
                    line-height: 1.6;
                }
    
                .content p {
                    margin: 10px 0;
                }
    
                .button {
                    display: inline-block;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    font-size: 16px;
                    margin-top: 20px;
                }
    
                .footer {
                    background-color: #f4f7fc;
                    padding: 15px;
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                    border-radius: 0 0 8px 8px;
                }
    
                .footer a {
                    color: #4CAF50;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
    
            <div class="container">
                <div class="header">
                    <h2>Thank You for Reaching Out!</h2>
                </div>
    
                <div class="content">
                    <p>Dear ${createContactusDto.email},</p>
                    <p>Thank you for contacting us. We have received your message and appreciate you taking the time to get in touch.</p>
                    <p>Our team will review your inquiry and get back to you as soon as possible. If your issue is urgent, please feel free to call us directly at [Phone Number].</p>
                    <p>In the meantime, feel free to visit our <a href="[Company Website]">website</a> for more information or resources that might be helpful to you.</p>
    
                    <a href="[Company Website]" class="button">Visit Our Website</a>
                </div>
    
                <div class="footer">
                    <p>If you did not contact us, please ignore this email.</p>
                    <p>&copy; 2024 Nourishubs. All rights reserved.</p>
                </div>
            </div>
    
        </body>
        </html>
      `;

    this.emailService.sendEmail(
      createContactusDto.email,
      'Thank you for ContactUs',
      `We will resolve your query soon ${createContactusDto.first_name} ${createContactusDto.last_name}`,
      htmlContent,
    );
    const contactUs = await this.contactusRepository.create(createContactusDto);

    return this.responseService.success(
      await i18n.translate('messages.queryCreated'),
      contactUs,
    );
  }

  async findAll(query: BasicQueryDto, i18n: I18nContext) {
    const {
      page = 1,
      limit = 10,
      searchQuery,
      orderBy = { createdAt: -1 },
    } = query;

    const skip = (page - 1) * limit;

    const filter = searchQuery
      ? {
          $or: [
            { email: { $regex: searchQuery, $options: 'i' } },
            { message: { $regex: searchQuery, $options: 'i' } },
            { first_name: { $regex: searchQuery, $options: 'i' } },
            { last_name: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {};

    const [queries, total, totalFiltered] = await Promise.all([
      this.contactusRepository.getContactUsQueryListWithCountryAndPAgination({
        filter,
        skip,
        limit,
        orderBy,
      }),
      this.contactusRepository.countDocuments({}),
      this.contactusRepository.countDocuments(filter),
    ]);

    const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
      getPaginationDetails({
        data: queries,
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

    const response = Serialize(QueryResponseDto, queries, {
      excludeExtraneousValues: true,
    });

    return this.responseService.success(
      await i18n.translate('messages.queryRetrieved'),
      { queries: response },
      meta,
    );
  }
}
