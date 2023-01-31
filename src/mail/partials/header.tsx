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
        src={`${baseUrl}/assets/img/logo.png`}
        width="205"
        height="64"
        alt="KogăWash"
        style={styles.logo}
      />
      { heading && <Heading style={styles.heading}>{heading}</Heading> }
    </>
  );
}
