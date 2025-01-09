import { applyDecorators, CanActivate, ExecutionContext, Injectable, SetMetadata, UseGuards } from "@nestjs/common"
import { ROLES } from "../constant"
import { Reflector } from "@nestjs/core";

interface MetaData {
    permissions: string[],
    passthrough?: boolean,
}

interface RoleMetadata {
    roles: string[],
    permissions: string[],
}

function comparesRoles(roles: string[], usersChileRoles: string[]) {
    if (!usersChileRoles || !usersChileRoles?.length) return false;

    const rolesSet = new Set(roles);

    return usersChileRoles.some(role => rolesSet.has(role))
}


function getkeyValueCheckObj(role: string) {
    switch (role) {
        case ROLES.VENDOR:
            return {
                status: "active",
                verificationStatus: "approved",
                thresHoldApprove: "approved"
            }
        default:
            return {
                status: "active",
                verificationStatus: "approved",
            }
    }
}

@Injectable()
class RouteCheck implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const skipPermissions = this.reflector.get<boolean>(
            'skipPermissions',
            context.getHandler(),
        );

        if (skipPermissions) {
            return true; 
        }
        const metaData = this.reflector.get<MetaData>("metadata", context.getHandler());

        const {
            permissions,
            passthrough = false,
        } = metaData;


        const request = context.switchToHttp().getRequest();
        const user = request?.user;

        if (!user || !user?.role?._id) {
            return false;
        }

        
        if (!passthrough) {

            const keyValueForCheck = getkeyValueCheckObj(user?.role?._id);

            for (const [key, value] of Object.entries(keyValueForCheck)) {
                if (user[key] !== value) {
                    console.log(`Mismatch found for key: ${key}. Expected: ${value}, Found: ${user[key]}`);
                    return false;
                }
            }
        }

        if (request.accessForHigherRole) {
            return true;
        }


        const userPermissions: string[] = user?.subPermissionsList || [];
        const hasPermission = permissions?.some(permission => userPermissions.includes(permission));


        if (hasPermission && passthrough) {
            return true;
        }


        return hasPermission;

    }
}



@Injectable()
class PermissionsCheck implements CanActivate {

    constructor(private readonly reflector: Reflector) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const skipPermissions = this.reflector.get<boolean>(
            'skipPermissions',
            context.getHandler(),
        );

        if (skipPermissions) {
            return true;
        }

        let metaData = this.reflector.get<RoleMetadata>('metadata', context.getClass());


        const { roles, permissions } = metaData;

        const request = context.switchToHttp().getRequest();
        const user = request?.user;

        if (!user || !user?.role?._id) {
            console.error('User or permissions list not found in the request. or user is not approved!');
            return false;
        }

         const childRoles = user?.role?.childRoles || [];

        if (comparesRoles(roles, childRoles)) {
            request.accessForHigherRole = true;
            return true;
        }

        if (!user.permissionList) {
            return false;
        }

        const userHasRole = roles.includes(user?.role?._id);

        const userPermissions: string[] = user?.permissionList;

        const hasPermission = permissions.some(permission => userPermissions.includes(permission));

        return hasPermission && userHasRole;

    }
}

export function SubPermissionGuard(data: MetaData) {
    return applyDecorators(
        SetMetadata("metadata", data),
        UseGuards(RouteCheck)
    )
}
export function PermissionGuard(data: RoleMetadata) {
    return applyDecorators(
        SetMetadata("metadata", data),
        UseGuards(PermissionsCheck)
    )
}
