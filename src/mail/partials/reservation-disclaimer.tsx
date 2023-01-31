import * as React from "react";
import * as styles from "../mail.styles";
import { Text } from "@react-email/text";


export default function ReservationDisclaimer() {
  return (
    <Text style={styles.muted}>
      Te rugăm să te prezinți întotdeauna cu 5 minute înaintea rezervării. Rezervările care
      nu sunt revendicate în primele 5 minute de la începerea acestora vor fi anulate.
    </Text>
  );
}
