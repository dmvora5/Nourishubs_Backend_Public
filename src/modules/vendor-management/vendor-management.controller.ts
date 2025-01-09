import { Controller } from '@nestjs/common';
import { VendorManagementService } from './vendor-management.service';

@Controller('vendor-management')
export class VendorManagementController {
  constructor(private readonly vendorManagementService: VendorManagementService) {}
}
