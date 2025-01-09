import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './models/role.schema';
import { PermissionRepository } from './permissions.repository';
import { SubPermissionRepository } from './subPermissions.repository';
import { Permission, PermissionSchema } from './models/permission.schema';
import { SubPermission, SubPermissionSchema } from './models/subPermission.schema';
import { RoleRepository } from './role.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: SubPermission.name, schema: SubPermissionSchema }

    ])
  ],
  providers: [RbacService, RoleRepository, PermissionRepository, SubPermissionRepository],
  exports: [RbacService, RoleRepository, PermissionRepository, SubPermissionRepository]
})
export class RbacModule { }
