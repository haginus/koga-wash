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

  async findAllByMachineId(machineId: string): Promise<MachineInstance[]> {
    return this.machineRepository.find({ where: { machine: { id: machineId } } });
  }

  async create(machineInstanceDto: MachineInstanceRequestDto) {
    const machine = await this.machinesService.findOne(machineInstanceDto.machineId);
    if(!machine) {
      throw new NotFoundException(`Machine with id ${machineInstanceDto.machineId} not found`);
    }
    return this.machineRepository.save({ ...machineInstanceDto, machine });
  }

  async update(id: string, machineInstanceDto: MachineInstanceRequestDto) {
    const machine = await this.machinesService.findOne(machineInstanceDto.machineId);
    if(!machine) {
      throw new NotFoundException(`Machine with id ${machineInstanceDto.machineId} not found`);
    }
    const machineInstance = await this.findOne(id);
    if(!machineInstance) {
      throw new NotFoundException(`Machine instance with id ${id} not found`);
    }
    return this.machineRepository.save({ ...machineInstance, ...machineInstanceDto, machine });
  }

  async delete(id: string) {
    const machineInstance = await this.findOne(id);
    if(!machineInstance) {
      throw new NotFoundException(`Machine instance with id ${id} not found`);
    }
    return this.machineRepository.delete(id);
  }
}