import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { MachineInstance } from "src/machines/schemas/machine-instance.schema";
import { Programme } from "src/machines/schemas/programme.schema";
import { User } from "src/users/schemas/user.schema";

export type ReservationDocument = mongoose.HydratedDocument<Reservation>;

@Schema()
export class Reservation {
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MachineInstance' })
  machineInstance: MachineInstance;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Programme' })
  programme: Programme;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop()
  status: ReservationStatus;
  
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

export enum ReservationStatus {
  PENDING = "PENDING",
  CHECKED_IN = "CHECKED_IN",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
  NOT_HONORED = "NOT_HONORED",
}