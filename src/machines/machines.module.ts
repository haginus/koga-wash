import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MachineInstancesController } from './machine-instances.controller';
import { MachineInstancesService } from './machine-instances.service';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { DryerMachine, DryerMachineSchema } from './schemas/dryer-machine.schema';
import { MachineInstance, MachineInstanceSchema } from './schemas/machine-instance.schema';
import { Machine, MachineSchema } from './schemas/machine.schema';
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
      { name: MachineInstance.name, schema: MachineInstanceSchema },
    ]),
  ],
  controllers: [MachinesController, MachineInstancesController],
  providers: [MachinesService, MachineInstancesService],
  exports: [MachinesService, MachineInstancesService],
})
export class MachinesModule {}
