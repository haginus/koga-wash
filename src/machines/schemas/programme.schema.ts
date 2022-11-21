import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Programme {

  _id: string;

  @Prop()
  name: string;

  @Prop()
  wheelIndex: number;

  @Prop()
  description: string;

  /** Duration of the programme in minutes. */
  @Prop()
  duration: number;

  @Prop()
  materialKind: MaterialKind;
}

export const ProgrammeSchema = SchemaFactory.createForClass(Programme);

export enum MaterialKind {
  COTTON = "COTTON",
  WOOL = "WOOL",
  SILK = "SILK",
  POLYESTER = "POLYESTER",
  RAYON = "RAYON",
  LINEN = "LINEN",
  MIXED = "MIXED",
}
