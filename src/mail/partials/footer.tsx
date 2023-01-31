import * as React from "react";
import * as styles from "../mail.styles";
import { Hr } from "@react-email/hr";
import { Text } from "@react-email/text";


export default function Footer() {
  return (
    <>
      <Hr style={styles.hr} />
      <Text style={styles.muted}>
        Căminul Mihail Kogălniceanu <br/>
        Bd. Mihail Kogălniceanu nr. 36-46, Sector 5, București, 050107
      </Text>
    </>
  );
}
