import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: '0.0.0.0',
        port: 1025,
        secure: false,
        auth: {
          user: 'user@example.com',
          pass: 'topsecret',
        },
      },
      defaults: {
        from: '"Kogă Wash" <noreply@spalatorie.caminkogalniceanu.ro>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter({
          dateFormat: (date: Date) => date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }),
          timeFormat: (date: Date) => date.toLocaleTimeString('ro-RO', { hour: 'numeric', minute: 'numeric' }),
        }),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
