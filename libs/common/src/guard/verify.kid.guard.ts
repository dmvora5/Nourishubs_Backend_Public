import { applyDecorators, CanActivate, ExecutionContext, Injectable, SetMetadata, UseGuards } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { KidService } from "src/modules/kids/kid.service";


@Injectable()
class KidCheck implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) { }


    async canActivate(context: ExecutionContext): Promise<boolean> {

        const key = this.reflector.get<string>(
            'key',
            context.getHandler(),
        );

        const request = context.switchToHttp().getRequest();

        const kidId = request.params[key] || request.body[key] || request.query[key];
        const user = request.user;

        if (!kidId) {
            console.log("Kid id not found");
            return false;
        }

        if (!user?.approvedKids?.includes(kidId)) {
            return false;
        }

        return true;
    }
}

export function KidVerificationGuard(data: string) {
    return applyDecorators(
        SetMetadata("key", data),
        UseGuards(KidCheck)
    )
}
