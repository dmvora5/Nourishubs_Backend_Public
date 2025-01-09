import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_KEY');
    sgMail.setApiKey(apiKey);
  }

  async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
    const from = this.configService.get<string>('SENDGRID_FROM_EMAIL');

    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error('SendGrid Error Details:', error.response.body);
      }
    }
  }
}
