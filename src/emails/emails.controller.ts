import { Controller, Get } from '@nestjs/common';
import { EmailsService } from './emails.service';

@Controller('email')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get()
  getEmail() {
    return this.emailsService.sendEmail();
  }
}
