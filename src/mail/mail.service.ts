import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bun venit pe Kogă Wash! Confirmă-ți adresa de email',
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

}
