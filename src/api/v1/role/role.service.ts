import { BasicQueryDto, getPaginationDetails, IRole } from '@app/common';
import { CommonResponseService } from '@app/common/services';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { RbacService } from 'src/modules/rbac/rbac.service';
import { RoleRepository } from 'src/modules/rbac/role.repository';

@Injectable()
export class RoleService {

    constructor(
        private readonly roleRepository: RoleRepository,
        private readonly rbacService: RbacService,
        private readonly responseService: CommonResponseService,
    ) { }


    async getRoles(
        childRoles: string[],
        i18n: I18nContext
    ) {

        const findQuery = {
            _id: { $in: childRoles || [] },
        };

        const roles = await this.roleRepository.find(findQuery, "_id name")

        return this.responseService.success(
            i18n.translate('messages.rolesRetrieved'),
            { roles },
            {}
        );
    }

    async getRolePermissions(
        roleId: string,
        loginUesrRole: IRole,
        i18n: I18nContext
    ) {

        if (!loginUesrRole.childRoles.includes(roleId)) {
            throw new ForbiddenException(i18n.translate("messages.permissionNotAccess"));
        }

        const role = await this.rbacService.getRoleWithPermissions(roleId);

        return this.responseService.success(
            i18n.translate('messages.permissionsRetrieved'),
            { permissions: role?.permissions || [] },
            {}
        );
    }

}
