import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { UserRepository } from '../../users/user.repository';
import { BasicQueryDto, getPaginationDetails } from '@app/common';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { I18nContext } from 'nestjs-i18n';
import { UpdateUserDto } from '../../users/dtos/update-user.dto';
import { UsernotificationService } from '../../usernotification/usernotification.service';

@Injectable()
export class UserManagementService {
     
}
