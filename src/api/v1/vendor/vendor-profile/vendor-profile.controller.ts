import { Controller } from '@nestjs/common';
import { VendorProfileService } from './vendor-profile.service';

@Controller('vendor-profile')
export class VendorProfileController {
  constructor(private readonly vendorProfileService: VendorProfileService) {}
}
