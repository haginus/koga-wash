import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import configuration from 'src/config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail.host'),
          port: configService.get('mail.port'),
          secure: configService.get('mail.secure'),
          auth: {
            user: configService.get('mail.auth.user'),
            pass: configService.get('mail.auth.pass'),
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
      inject: [ConfigService],
    })
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
