import { Injectable } from "@nestjs/common";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Machine } from "./enitities/machine.entity";
import { Programme } from "./enitities/programme.entity";

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine) private machineRepository: Repository<Machine>,
    @InjectRepository(Programme) private programmeRepository: Repository<Programme>,
  ) {}

  async findAll(): Promise<Machine[]> {
    return this.machineRepository.find();
  }

  async findOne(id: string): Promise<Machine> {
    return this.machineRepository.findOneBy({ id });
  }

  async create(machineDto: CreateMachineDto) {

    return this.machineRepository.save(machineDto as any);
  }

  async findProgrammeById(id: string) {
    return this.programmeRepository.findOneBy({ id });
  }
}