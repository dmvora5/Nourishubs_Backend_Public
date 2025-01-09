import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RbacModule } from 'src/modules/rbac/rbac.module';

@Module({
  imports: [RbacModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule { }
