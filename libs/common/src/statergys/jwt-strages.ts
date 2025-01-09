import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { I18nService } from "nestjs-i18n";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/api/v1/users/users.service";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        protected readonly configService: ConfigService,
        protected readonly userService: UsersService,
        protected readonly i18nService: I18nService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        })
    }


    async validate(payload: any) {
        const user = await this.userService.findUserWithPermissions(payload.sub);

        if (!user) {
            throw new UnauthorizedException(this.i18nService.translate("messages.userNotFound"))
        }


        const permissionList = [];
        const subPermissionsList = [];


        user.permissions.forEach((permission: any) => {
            permissionList.push(permission?.permission?._id);
            subPermissionsList.push(...permission.subPermissions?.map(ele => ele?._id));
        });


        return {
            permissionList: Array.from(new Set([...permissionList])),
            subPermissionsList: Array.from(new Set([...subPermissionsList])),
            ...user,
            _id: user?._id?.toString(),
        };
    }

}
