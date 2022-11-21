import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { Machine, MachineDocument } from "./schemas/machine.schema";
import * as mongoose from 'mongoose';

@Injectable()
export class MachinesService {
  constructor(@InjectModel(Machine.name) private machineModel: Model<MachineDocument>) {}

  async findAll(): Promise<Machine[]> {
    return this.machineModel.find().exec();
  }

  async findOne(id: string): Promise<Machine> {
    return this.machineModel.findById(id).exec();
  }

  async create(machineDto: CreateMachineDto) {
    const createdMachine = new this.machineModel(machineDto);
    return createdMachine.save();
  }

  async findProgrammeById(id: string) {
    const machines = await this.findAll();
    for(const machine of machines) {
      for(const programme of machine.programmes) {
        if(programme._id.toString() === id) {
          return programme;
        }
      }
    }
  }
}