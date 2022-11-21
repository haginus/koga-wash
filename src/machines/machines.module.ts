import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { DryerMachine, DryerMachineSchema } from './schemas/dryer-machine.schema';
import { Machine, MachineSchema } from './schemas/machine.schema';
import { Programme, ProgrammeSchema } from './schemas/programme.schema';
import { WashingMachine, WashingMachineSchema } from './schemas/washing-machine.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Machine.name,
        schema: MachineSchema,
        discriminators: [
          { name: WashingMachine.name, schema: WashingMachineSchema },
          { name: DryerMachine.name, schema: DryerMachineSchema },
        ],
      },
    ]),
  ],
  controllers: [MachinesController],
  providers: [MachinesService],
})
export class MachinesModule {}
