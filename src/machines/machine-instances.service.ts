import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MachineInstanceRequestDto } from "./dto/machine-instance-request.dto";
import { MachineInstance } from "./enitities/machine-instance.entity";
import { MachinesService } from "./machines.service";

@Injectable()
export class MachineInstancesService {
  constructor(@InjectRepository(MachineInstance) private machineRepository: Repository<MachineInstance>,
    private readonly machinesService: MachinesService) {}

  async findOne(id: string): Promise<MachineInstance> {
    return this.machineRepository.findOneBy({ id });
  }

  async findAll(): Promise<MachineInstance[]> {
    return this.machineRepository.find();
  }

  async create(machineInstanceDto: MachineInstanceRequestDto) {
    const machine = await this.machinesService.findOne(machineInstanceDto.machineId);
    if(!machine) {
      throw new NotFoundException(`Machine with id ${machineInstanceDto.machineId} not found`);
    }
    return this.machineRepository.save({ machine });
  }
}