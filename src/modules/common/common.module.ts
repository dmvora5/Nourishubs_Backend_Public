import { CommonResponseService, EmailService, UploadService } from "@app/common/services";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import * as path from 'path';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            cache: true,
            expandVariables: true
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_CONNECTION_STRING')
            }),
            inject: [ConfigService]
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: path.join(__dirname, "..", "src", "i18n"),
                watch: true,
            },
            resolvers: [
                { use: AcceptLanguageResolver, options: ['x-custom-lang', 'accept-language'] },
                QueryResolver
            ],
        }),
    ],
    providers: [EmailService, CommonResponseService, UploadService],
    exports: [EmailService, CommonResponseService, UploadService]
})
export class CommonModule { }
