import { Injectable } from "@nestjs/common";
import { MachineRequestDto } from "./dto/machine-request.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Machine } from "./enitities/machine.entity";

@Injectable()
export class MachinesService {
  constructor(@InjectRepository(Machine) private machineRepository: Repository<Machine>) {}

  async findAll(): Promise<Machine[]> {
    return this.machineRepository.find({ relations: ['instances']});
  }

  async findOne(id: string): Promise<Machine> {
    return this.machineRepository.findOne({ where: { id }, relations: ['instances']});
  }

  async create(machineDto: MachineRequestDto) {
    return this.machineRepository.save(machineDto);
  }
}