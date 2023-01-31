import { Button } from '@react-email/button';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import * as React from 'react';
import MailScreen from '../partials/mail-screen';
import * as styles from "../mail.styles";
import { baseUrl } from '../constants';
import { User } from 'src/users/entities/user.entity';

interface EmailProps {
  user: User;
  token: string;
}

export default function Welcome({ user, token }: EmailProps) {
  return (
    <MailScreen heading="Bun venit pe Kogă Wash!">
      <Text style={styles.paragraph}>
        Salutare, {user.firstName} {user.lastName}! <br/>
        Bine ai venit în platforma de spălătorie a căminului M. Kogălniceanu! 
        Te rugăm să îți confimi contul apăsând pe link-ul de mai jos.
      </Text>
      <Section style={styles.buttonContainer}>
        <Button pY={12} pX={24} style={styles.button} href={`${baseUrl}/login/token/${token}`}>
          Confirmă contul
        </Button>
      </Section>
    </MailScreen>
  );
}
