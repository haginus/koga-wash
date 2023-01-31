import { Controller, Get, Param } from '@nestjs/common';
import { Dev } from 'src/auth/decorators/dev.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { MailService } from 'src/mail/mail.service';

@Controller('dev')
@Dev()
@Public()
export class DevController {

  constructor(private mailService: MailService) {}

  @Get('mail/:template')
  async test(@Param('template') template: string) {
    return this.mailService.getMockMail(template);
  }
}
