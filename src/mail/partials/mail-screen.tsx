import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import * as React from 'react';
import Footer from './footer';
import Header from './header';
import * as styles from "../mail.styles";

interface MailScreenProps {
  heading?: string;
  children?: React.ReactNode;
}

export default function MailScreen({ heading, children }: MailScreenProps) {
  return (
    <Html>
      <Head />
      <Preview>{heading}</Preview>
      <Section style={styles.main}>
        <Container style={styles.container}>
          <Header heading={heading} />
          {children}
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
