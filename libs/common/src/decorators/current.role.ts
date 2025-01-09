import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const CurrentRole = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        request.role = request?.user?.role
        return  request.role;
    }
)