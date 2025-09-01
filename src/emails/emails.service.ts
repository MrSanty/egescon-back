import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { Resend } from 'resend';
import WelcomeEmail from './templates/welcome';

@Injectable()
export class EmailsService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendEmail(): Promise<string> {
    const emailHtml = await render(
      WelcomeEmail({
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        password: 'temp-password-1234',
      }),
    );

    try {
      const { data, error } = await this.resend.emails.send({
        from: 'No Reply <no-reply@mrsanty.me>',
        to: 'santyquintero201878@gmail.com',
        subject: 'Welcome to Resend',
        html: emailHtml,
      });

      if (error) {
        console.error('Error sending email:', error);
        return `Error sending email: ${error.message}`;
      }

      console.log('Email sent successfully:', data);

      return 'Email sent successfully';
    } catch (error) {
      console.error('Unexpected error:', error);
      return `Unexpected error: ${error.message}`;
    }
  }
}
