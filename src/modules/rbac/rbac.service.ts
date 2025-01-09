import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';

@Injectable()
export class RbacService {

    constructor(
        private readonly roleRepository: RoleRepository
    ) { }


    async getRoleWithPermissions(id: string) {
        const role = await this.roleRepository.getRoleWithPermissions(id);
        if (!role)
            return null;
        return {
            ...role,
            permissions: role.permissions.map((perm: any) => ({
                ...perm.permission,
                subPermissions: perm.subPermissions,
            })),
        };
    };

    async findRoleById(id: string) {
        return this.roleRepository.findById(id);
    }
}
