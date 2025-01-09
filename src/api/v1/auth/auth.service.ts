import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ParentRepository, SchoolRepository, UserRepository, VendorRepository } from '../users/user.repository';
import { CommonResponseService, EmailService } from '@app/common/services';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RbacService } from 'src/modules/rbac/rbac.service';
import { SignUpDto } from './dto/signUp.dto';
import { I18nContext } from 'nestjs-i18n';
import { ROLES, Serialize, TAMPLATES, TAMPLATES_FUNCTIONS } from '@app/common';
import { SignUpResponse } from './dto/responseDtos/response.dtos';
import { LoginWithPassword } from './dto/login-with-password.dto';
import { LoginDto } from './dto/login.dto';
import { NewPasswordDto } from './dto/reset-psw.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { OtpUserRepository } from './otp.repository';

@Injectable()
export class AuthService {

  constructor(
    private readonly rbacServices: RbacService,
    private readonly userRepository: UserRepository,
    private readonly vendorRepository: VendorRepository,
    private readonly schoolRepository: SchoolRepository,
    private readonly parentRepository: ParentRepository,
    private readonly otpRepository: OtpUserRepository,
    private readonly responseService: CommonResponseService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) { }

  async signUp(payload: SignUpDto, i18n: I18nContext) {

    const { password, confirm_password, ...userData } = payload.data;

    if (password !== confirm_password) {
      throw new BadRequestException(i18n.translate('validation.confirmPassword.validateIf'));
    }

    const emailExist = (await this.userRepository.findOne({ email: userData.email }))?.toJSON();

    if (emailExist && emailExist?.isEmailVerified) {
      throw new UnprocessableEntityException(i18n.translate('messages.emailExists'));
    }

    if(!emailExist?.isEmailVerified) {
      const { otp, expiresAt } = await this.sendOtp({ email: userData.email, templateFn: TAMPLATES.SIGNUPTEMPLATE });
      return this.responseService.success(await i18n.translate('messages.userCreated'), {
        ...emailExist,
        otp: otp,
        expiresAt: expiresAt,
      });
    }

    const role = await this.rbacServices.findRoleById(payload.type);

    if (!role) {
      throw new NotFoundException(i18n.translate('messages.roleNotFound'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertData: any = {
      ...userData,
      role: role._id,
      isApproved: false,
      password: hashedPassword,
      permissions: role.permissions,
      location: {
        latitude: payload.data?.latitude,
        address: payload.data?.address,
        longitude: payload.data?.longitude,
        type: 'Point',
        coordinates: [payload.data?.longitude, payload.data?.latitude],
        state: payload.data?.state,
        city: payload.data?.city,
        district: payload.data?.district,
        country: payload.data?.country,
      },
    }

    let newUser;

    switch (payload.type) {
      case ROLES.VENDOR:
        newUser = await this.vendorRepository.create(insertData);
        break;
      case ROLES.SCHOOL:
        newUser = await this.schoolRepository.create(insertData);
        break;
      case ROLES.PARENT:
        newUser = await this.parentRepository.create(insertData);
        break;
      default:
        throw new BadRequestException("validation.type.isIn");
    }

    const responseUser = Serialize(SignUpResponse, newUser);

    const { otp, expiresAt } = await this.sendOtp({ email: userData.email, templateFn: TAMPLATES.SIGNUPTEMPLATE });

    return this.responseService.success(await i18n.translate('messages.userCreated'), {
      ...responseUser,
      otp: otp,
      expiresAt: expiresAt,
    });

  }

  async loginWithPassword(loginDto: LoginWithPassword, i18n: I18nContext) {

    const { ...userData } = loginDto;

    let user = (await this.userRepository.findOne({ email: userData.email }))?.toJSON();

    if (!user) {
      throw new BadRequestException(await i18n.translate('messages.emailNotFound'));
    }

    if (!user.isEmailVerified) {
      const { otp, expiresAt } = await this.sendOtp({ email: userData.email, templateFn: TAMPLATES.LOGINWITHPASSWORD });

      const data = {
        userData: {
          isEmailVerified: false
        },
        otp: otp,
        expiresAt: expiresAt
      }

      return this.responseService.success(await i18n.translate('messages.verifyEmail'), data);

    }



    const payload = { username: user.email, sub: user._id };

    const data = {
      userData: user,
      access_token: this.jwtService.sign(payload)
    }
    return this.responseService.success(await i18n.translate('messages.loginSuccess'), data);

  }

  async validateUser(loginDto: LoginWithPassword): Promise<any> {
    try {
      const { ...userData } = loginDto;

      const user = (await this.userRepository.findOne({ email: userData.email }, "+password"))?.toJSON();
      console.log('user', user)
      if (user && await bcrypt.compare(userData.password, user.password)) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LoginDto, i18n: I18nContext) {
    try {
      const { ...userData } = loginDto;
      let user = (await this.userRepository.findOne({ email: userData.email }))?.toJSON();

      if (!user) {
        throw new BadRequestException(await i18n.translate('messages.emailNotFound'));
      }

      const { otp, expiresAt } = await this.sendOtp({ email: user?.email, templateFn: TAMPLATES.LOGIN });

      return this.responseService.success(await i18n.translate('messages.login'), { otp, expiresAt });

    } catch (error) {
      throw error;
    }

  }

  async resetPsw(NewPasswordDto: NewPasswordDto, i18n: I18nContext): Promise<any> {
    const { otp, email, newPassword } = NewPasswordDto;

    let user = (await this.userRepository.findOne({ email }))?.toObject();

    if (!user) {
      throw new NotFoundException(await i18n.translate('messages.invalidOtp'));
    }

    const otpData = await this.otpRepository.findOne({ email });

    if (!otpData) {
      throw new NotFoundException(await i18n.translate('messages.otpexpired'));
    }

    if (otpData?.otp !== otp) {
      throw new BadRequestException(await i18n.translate('messages.invalidOtp'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);;

    const updatedUser = await this.userRepository.findOneAndUpdate(
      { email: user.email },
      { password: hashedPassword }
    );

    await this.otpRepository.findByIdAndDelete(otpData._id?.toString());

    const data = {
      userData: updatedUser,
    };
    return this.responseService.success(
      await i18n.translate('messages.passwordResetSuccess'),
      data
    );

  }

  async resendOTP(loginDto: LoginDto, i18n: I18nContext) {
    try {
      const { ...userData } = loginDto;
      let user = (await this.userRepository.findOne({ email: userData.email }))?.toObject();
      if (user) {

        const { otp, expiresAt } = await this.sendOtp({ email: user?.email, templateFn: TAMPLATES.RESENDOTP })

        return this.responseService.success(await i18n.translate('messages.otpResent'), { otp, expiresAt });

      } else {
        throw new BadRequestException(await i18n.translate('messages.emailNotFound'));
      }

    } catch (error) {
      throw error;
    }

  }

  async verifyUser(verifyUserDto: VerifyUserDto, i18n: I18nContext,): Promise<any> {
    const { ...userData } = verifyUserDto;
    let user = await this.userRepository.findOne({ email: userData?.email });

    if (!user) {
      throw new NotFoundException(await i18n.translate('messages.emailNotFound'));
    }

    const otpData = await this.otpRepository.findOne({
      email: userData?.email
    })

    if (!otpData) {
      throw new NotFoundException(await i18n.translate('messages.otpexpired'));
    }

    if (otpData?.otp !== userData?.otp) {
      throw new BadRequestException(await i18n.translate('messages.invalidOtp'));
    }

    user.isEmailVerified = true;

    await user.save();

    await this.otpRepository.findByIdAndDelete(otpData._id?.toString());

    const payload = { username: user.email, sub: user._id };

    const data = {
      "userData": user,
      "access_token": this.jwtService.sign(payload)
    }
    return this.responseService.success(await i18n.translate('messages.loginSuccess'), data);


  }

  async forgotPsw(loginDto: LoginDto, i18n: I18nContext) {
    const { ...userData } = loginDto;
    let user = (await this.userRepository.findOne({ email: userData.email }))?.toObject();

    if (!user) {
      throw new BadRequestException(await i18n.translate('messages.emailNotFound'));
    }

    const response = await this.sendOtp({ email: user.email, templateFn: TAMPLATES.FORGETPASSWORD })

    return this.responseService.success(await i18n.translate('messages.forgotPsw'), response);

  }


  //private methods
  private async sendOtp({ email, templateFn }) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const result = await this.otpRepository.upsert(
      { email },
      {
        otp,
        expiresAt: new Date()
      }
    );
    const htmlContent = typeof TAMPLATES_FUNCTIONS[templateFn] === 'function' ? TAMPLATES_FUNCTIONS[templateFn]({ email, otp }) : ""
    // this.emailService.sendEmail(
    //   email,
    //   'Resend OTP',
    //   'otp resent',
    //   htmlContent
    // )


    return {
      otp,
      expiresAt: result?.expiresAt
    }
  }

}