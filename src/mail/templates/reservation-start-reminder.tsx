import { Button } from '@react-email/button';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import * as React from 'react';
import MailScreen from '../partials/mail-screen';
import * as styles from "../mail.styles";
import { baseUrl } from '../constants';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import ReservationDisclaimer from '../partials/reservation-disclaimer';

interface EmailProps {
  reservation: Reservation;
  minutes: number;
}

export default function ReservationStartReminder({ reservation, minutes }: EmailProps) {
  return (
    <MailScreen heading="Rezervare ta se apropie">
      <Text style={styles.paragraph}>
        Salutare, {reservation.user.firstName} {reservation.user.lastName}! <br/>
        Rezervarea ta la <strong>{ reservation.machineInstance.name }</strong>{' '}
        pentru programul <strong>{ reservation.programme.name }</strong>{' '}
        începe în { minutes } minute.
      </Text>
      <Section style={styles.buttonContainer}>
        <Button pY={12} pX={24} style={styles.button} href={`${baseUrl}/${reservation.user.role}/reservations/${reservation.id}`}>
          Accesează rezervarea
        </Button>
      </Section>
      <ReservationDisclaimer />
    </MailScreen>
  );
}
