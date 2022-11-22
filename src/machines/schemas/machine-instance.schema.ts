import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Machine } from "./machine.schema";

export type MachineInstanceDocument = mongoose.HydratedDocument<MachineInstance>;

@Schema()
export class MachineInstance {

  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Machine' })
  machine: Machine;

}

export const MachineInstanceSchema = SchemaFactory.createForClass(MachineInstance);
