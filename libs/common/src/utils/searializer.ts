import { plainToInstance } from "class-transformer";


export function Serialize(type: any, dto: any, options: object = {}) {
    return plainToInstance(type, dto, options)
}