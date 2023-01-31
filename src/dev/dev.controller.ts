import { Controller, Get, Param } from '@nestjs/common';
import { Dev } from 'src/auth/decorators/dev.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { MailService } from 'src/mail/mail.service';
import { mailContexts } from 'src/mail/mock';

@Controller('dev')
@Dev()
@Public()
export class DevController {

  constructor(private mailService: MailService) {}

  @Get('mail')
  async listMailTemplates() {
    const templates = Object.keys(mailContexts).map(templateName => `
      <li><a href="${templateName}">${templateName}</a></li>
    `);
    return `
      <h1>Mail templates</h1>
      <ul>
        ${templates.join('')}
      </ul>
    `;
  }

  @Get('mail/:template')
  async renderTemplate(@Param('template') template: string) {
    return this.mailService.getMockMail(template);
  }
}
