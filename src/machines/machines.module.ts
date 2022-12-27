import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DryerMachine } from './enitities/dryer-machine.entity';
import { MachineInstance } from './enitities/machine-instance.entity';
import { Machine } from './enitities/machine.entity';
import { Programme } from './enitities/programme.entity';
import { WashingMachine } from './enitities/washing-machine.entity';
import { MachineInstancesController } from './machine-instances.controller';
import { MachineInstancesService } from './machine-instances.service';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Machine, WashingMachine, DryerMachine, MachineInstance, Programme]),
  ],
  controllers: [MachinesController, MachineInstancesController],
  providers: [MachinesService, MachineInstancesService],
  exports: [MachinesService, MachineInstancesService],
})
export class MachinesModule {}
