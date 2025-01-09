import { Injectable, BadRequestException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadService {
  private s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadImage(file: Express.Multer.File, type: string, i18n: I18nContext): Promise<string> {
    if (!file) {
      throw new BadRequestException(i18n.translate('messages.noFile'));
    }

    const fileExtension = file.originalname.split('.').pop();
    const filename = `${uuid()}.${fileExtension}`;
    const key = `${type}/${filename}`;

    const params = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const { Location } = await this.s3.upload(params).promise();
      return Location;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(i18n.translate('messages.uploadImageFail'));
    }
  }

  async uploadDocument(file: Express.Multer.File, type: string, i18n: I18nContext): Promise<string> {
    if (!file) {
      throw new BadRequestException(i18n.translate('messages.noFile'));
    }

    const fileExtension = file.originalname.split('.').pop();
    const filename = `${uuid()}.${fileExtension}`;
    const key = `${type}/${filename}`;

    const params = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const { Location } = await this.s3.upload(params).promise();
      return Location; 
    } catch (error) {
      console.log(error);
      throw new BadRequestException(i18n.translate('messages.uploadImageFail'));
    }
  }

  async deleteDocument(docUrl: string, type: string, i18n: I18nContext): Promise<void> {
    if (!docUrl) {
        throw new BadRequestException(i18n.translate('messages.noUrlProvided'));
    }
    const s3BaseUrl = this.configService.get<string>('S3_BASE_URL');
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const key = docUrl ? docUrl.split(s3BaseUrl)[1].replace(/^\/+/, '') : '';

    if (!key || !key.startsWith(type)) {
        throw new BadRequestException(i18n.translate('messages.invalidKey'));
    }

    const params = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        await this.s3.deleteObject(params).promise();
    } catch (error) {
        console.error('Error deleting document from S3:', error);
        throw new BadRequestException(i18n.translate('messages.deleteImageFail'));
    }
}



async deleteFile(fileUrl: string, i18n: I18nContext): Promise<void> {
    
  const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  const s3BaseUrl = `https://${bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/`;
  const fileKey = fileUrl ? fileUrl.split(s3BaseUrl)[1].replace(/^\/+/, '') : '';

  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    if(fileKey){

      await this.s3.deleteObject(params).promise();
      console.log(`File ${fileKey} deleted successfully from S3`);
    }
  } catch (error) {
    console.log(error);
    throw new BadRequestException(i18n.translate('messages.deleteImageFail'));
  }
}
}
