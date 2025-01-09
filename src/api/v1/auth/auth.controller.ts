import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/signUp.dto';
import { Validate } from '@app/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { LoginWithPassword } from './dto/login-with-password.dto';
import { LoginDto } from './dto/login.dto';
import { NewPasswordDto } from './dto/reset-psw.dto';
import { VerifyUserDto } from './dto/verify-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiBody({
    description: "Sign Up for a user",
    type: SignUpDto
  })
  @Validate()
  async signUp(@Body() payload: SignUpDto, @I18n() i18n: I18nContext) {
    return this.authService.signUp(payload, i18n);
  }

  @Post('loginWithPassword')
  @Validate()
  async loginWithPassword(@Body() loginDto: LoginWithPassword, @I18n() i18n: I18nContext) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.loginWithPassword(loginDto, i18n);
  }

  @Post('login')
  @Validate()
  async login(@Body() loginDto: LoginDto, @I18n() i18n: I18nContext) {
    return this.authService.login(loginDto, i18n);
  }

  @Post('reset-psw')
  @Validate()
  async resetPsw(@Body() NewPasswordDto: NewPasswordDto, @I18n() i18n: I18nContext) {
    return this.authService.resetPsw(NewPasswordDto, i18n);
  }

  @Post('resend')
  @Validate()
  async resend(@Body() loginDto: LoginDto, @I18n() i18n: I18nContext) {
    return this.authService.resendOTP(loginDto, i18n);
  }

  @Post('verifyUser')
  @Validate()
  async verifyUser(@Body() verifyUserDto: VerifyUserDto, @I18n() i18n: I18nContext) {
    return this.authService.verifyUser(verifyUserDto, i18n);
  }

  @Post('forgot-password')
  @Validate()
  async forgotPsw(@Body() loginDto:LoginDto,@I18n() i18n: I18nContext) {
        return this.authService.forgotPsw(loginDto,i18n);
  }
}
