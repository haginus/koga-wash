import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { Machine, MachineDocument } from "./schemas/machine.schema";

@Injectable()
export class MachinesService {
  constructor(@InjectModel(Machine.name) private machineModel: Model<MachineDocument>) {}

  async findAll(): Promise<Machine[]> {
    return this.machineModel.find().exec();
  }

  async create(machineDto: CreateMachineDto) {
    const createdMachine = new this.machineModel(machineDto);
    return createdMachine.save();
  }
}