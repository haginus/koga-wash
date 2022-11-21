import { Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class DryerMachine {

}

export const DryerMachineSchema = SchemaFactory.createForClass(DryerMachine);