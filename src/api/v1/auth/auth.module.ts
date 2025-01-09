import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@app/common/statergys/jwt-strages';
import { RbacModule } from 'src/modules/rbac/rbac.module';
import { OtpUserRepository } from './otp.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './models/otp.schema';

@Module({
  imports: [
    UsersModule,
    RbacModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpUserRepository],
})
export class AuthModule { }
