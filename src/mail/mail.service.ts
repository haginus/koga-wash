import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { ReactEmailAdapter } from './adapters/react-email.adapter';
import { mailContexts } from './mock';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `${this.configService.get('frontend.url')}/login/token/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bun venit pe Kogă Wash! Confirmă-ți contul',
      template: './welcome',
      context: { user, url },
    });
  }

  async sendReservationConfirmation(reservation: Reservation) {
    await this.mailerService.sendMail({
      to: reservation.user.email,
      subject: 'Rezervarea ta a fost confirmată',
      template: './reservation-confirmation',
      context: { reservation },
    });
  }

  async sendReservationStartReminder(reservation: Reservation) {
    const minutes = Math.round((reservation.startTime.getTime() - Date.now()) / 1000 / 60);
    await this.mailerService.sendMail({
      to: reservation.user.email,
      subject: 'Rezervarea ta se apropie',
      template: './reservation-start-reminder',
      context: { reservation, minutes },
    });
  }

  async sendReservationEndReminder(reservation: Reservation) {
    const minutes = Math.round((reservation.endTime.getTime() - Date.now()) / 1000 / 60);
    await this.mailerService.sendMail({
      to: reservation.user.email,
      subject: 'Programul se apropie de sfârșit',
      template: './reservation-end-reminder',
      context: { reservation, minutes },
    });
  }

  async getMockMail(templateName: string) {
    const mailContext = mailContexts[templateName];
    if(!mailContext) {
      throw new BadRequestException(`No mock mail context for template ${templateName}`);
    }
    const adapter = new ReactEmailAdapter();
    const templatePath = join(__dirname, 'templates', templateName + '.js');
    return adapter.renderTemplate(templatePath, mailContext);
  }
}
