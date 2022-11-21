import { Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class WashingMachine {

}

export const WashingMachineSchema = SchemaFactory.createForClass(WashingMachine);