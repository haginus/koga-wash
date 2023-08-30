import { Button } from '@react-email/button';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import * as React from 'react';
import MailScreen from '../partials/mail-screen';
import * as styles from "../mail.styles";
import { baseUrl } from '../constants';
import { Reservation } from 'src/reservations/entities/reservation.entity';

interface EmailProps {
  reservation: Reservation;
}

export default function ReservationEndReminder({ reservation }: EmailProps) {
  const minutes = Math.round((reservation.endTime.getTime() - Date.now()) / 1000 / 60);
  return (
    <MailScreen heading="Programul se apropie de sfârșit">
      <Text style={styles.paragraph}>
        Salutare, {reservation.user.firstName} {reservation.user.lastName}! <br/>
        Programul <strong>{ reservation.programme.name }</strong>{' '}
        la <strong>{ reservation.machineInstance.name }</strong>{' '}
        se încheie în { minutes } minute.
      </Text>
      <Section style={styles.buttonContainer}>
        <Button pY={12} pX={24} style={styles.button} href={`${baseUrl}/${reservation.user.role}/reservations/${reservation.id}`}>
          Accesează rezervarea
        </Button>
      </Section>
    </MailScreen>
  );
}
