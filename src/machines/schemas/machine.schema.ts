import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DryerMachine } from "./dryer-machine.schema";
import { WashingMachine } from "./washing-machine.schema";
import { Programme, ProgrammeSchema } from "./programme.schema";
import { HydratedDocument } from "mongoose";

export type MachineDocument = HydratedDocument<Machine>;

@Schema({ discriminatorKey: 'kind' })
export class Machine {

  @Prop({
    type: String,
    required: true,
    enum: [WashingMachine.name, DryerMachine.name],
  })
  kind: string;

  @Prop()
  make: string;

  @Prop()
  model: string;

  @Prop({ type: [ProgrammeSchema] })
  programmes: Programme[];
}

export const MachineSchema = SchemaFactory.createForClass(Machine);