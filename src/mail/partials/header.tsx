import * as React from "react";
import { Heading } from "@react-email/heading";
import { Img } from "@react-email/img";
import * as styles from "../mail.styles";
import { baseUrl } from "../constants";

interface HeaderProps {
  heading: string;
}

export default function Header({ heading }: HeaderProps) {
  return (
    <>
      <Img
        src={`${baseUrl}/static/logo.png`}
        width="160"
        height="60"
        alt="KogăWash"
        style={styles.logo}
      />
      { heading && <Heading style={styles.heading}>{heading}</Heading> }
    </>
  );
}
