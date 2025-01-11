import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  CancleOrderDto,
  CreateCartDto,
  CreateCartItemDto,
} from '../../../../modules/orders/dtos/cancle-order.dtos';
import {
  BasicQueryDto,
  getPaginationDetails,
  RADIUS_OF_EARTH_IN_METER,
  ROLES,
} from '@app/common';
@Injectable()
export class OrdersService {
  

 
}
