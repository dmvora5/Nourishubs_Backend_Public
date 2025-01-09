import { ALL_PERMISSION, INSERT_RBAC_DATA } from '@app/common/data/role-and-permissions';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PermissionRepository } from 'src/modules/rbac/permissions.repository';
import { RoleRepository } from 'src/modules/rbac/role.repository';
import { SubPermissionRepository } from 'src/modules/rbac/subPermissions.repository';
import * as bcrypt from 'bcryptjs';
import { ROLES } from '@app/common';
import { OtherUserRepository } from 'src/api/v1/users/user.repository';
import { CountryRepository } from 'src/api/v1/countries/countries.repository';
import { COUNTRIES } from '@app/common/data/countryData';


@Injectable()
export class SeederService implements OnApplicationBootstrap {

    constructor(
        private readonly permissionRepository: PermissionRepository,
        private readonly subPermissionRepository: SubPermissionRepository,
        private readonly roleRepository: RoleRepository,
        private readonly otherUserRepository: OtherUserRepository,
        private readonly countryRepository: CountryRepository
    ) { }

    async onApplicationBootstrap() {
        try {
            console.log('Seeding start')
            await this.seedPermissionsAndSubPermissions();
            await this.seedRoles();
            await this.seeCountryData();
            await this.seedSupperAdmin();
            console.log('Seeding complate');
            process.exit(0);
        } catch (err) {
            console.log('err', err?.message)
            process.exit(0);
        }
    }

    async seedPermissionsAndSubPermissions() {

        for (const permissionKey in ALL_PERMISSION) {
            const permission = ALL_PERMISSION[permissionKey];


            await this.permissionRepository.upsert(
                { _id: permission._id },
                {
                    _id: permission._id,
                    name: permission.name,
                }
            );

            for (const subPermission of permission?.subPermissions || []) {
                await this.subPermissionRepository.upsert(
                    { _id: subPermission._id },
                    {
                        _id: subPermission._id,
                        name: subPermission.name,
                    }
                );
            }
        }
    }

    async seedRoles() {
        for (const roleKey in INSERT_RBAC_DATA) {
            const role = INSERT_RBAC_DATA[roleKey];

            await this.roleRepository.upsert(
                { _id: role._id },
                {
                    _id: role._id,
                    name: role.name,
                    childRoles: role.childRoles || [],
                    permissions: role.permissions || [],
                }
            )
        }
    }

    async seedSupperAdmin() {

        const roleData = INSERT_RBAC_DATA[ROLES.SUPER_ADMIN]

        const password = await bcrypt.hash("admin@123", 10);


        await this.otherUserRepository.upsert(
            { role: ROLES.SUPER_ADMIN },
            {
                first_name: "Super Admin",
                last_name: "Super Admin",
                email: "admin@nourishubs.com",
                phoneNo: "919999999999",
                password,
                status: "active",
                verificationStatus: "approved",
                role: ROLES.SUPER_ADMIN,
                permissions: roleData?.permissions,
                isEmailVerified: true,
            }
        )
    }

    async seeCountryData() {
        const existingCount = await this.countryRepository.countDocuments({});
        if (existingCount > 0) {
            return;
        }
        await this.countryRepository.insertMany(COUNTRIES);

    }

}
