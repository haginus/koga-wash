import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMachineInstanceDto } from "./dto/create-machine-instance.dto";
import { MachinesService } from "./machines.service";
import { MachineInstance, MachineInstanceDocument } from "./schemas/machine-instance.schema";

@Injectable()
export class MachineInstancesService {
  constructor(@InjectModel(MachineInstance.name) private machineInstanceModel: Model<MachineInstanceDocument>,
    private readonly machinesService: MachinesService) {}

  async findAll(): Promise<MachineInstance[]> {
    return this.machineInstanceModel.find().populate("machine").exec();
  }

  async create(machineInstanceDto: CreateMachineInstanceDto) {
    const machine = await this.machinesService.findOne(machineInstanceDto.machineId);
    if(!machine) {
      throw new NotFoundException(`Machine with id ${machineInstanceDto.machineId} not found`);
    }
    const createdMachineInstance = new this.machineInstanceModel({ machine });
    return createdMachineInstance.save();
  }
}