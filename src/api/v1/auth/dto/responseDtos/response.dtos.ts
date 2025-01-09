import { Exclude } from "class-transformer";




export class SignUpResponse {

    @Exclude()
    password: string;

    @Exclude()
    permissions: any;

}
