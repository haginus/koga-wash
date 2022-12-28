import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProgrammeRequestDto } from "./dto/programme-request.dto";
import { Programme } from "./enitities/programme.entity";
import { MachinesService } from "./machines.service";

@Injectable()
export class ProgrammesService {
  constructor(@InjectRepository(Programme) private programmeRepository: Repository<Programme>,
    private readonly machinesService: MachinesService) {}

  async findOne(id: string) {
    const programme = await this.programmeRepository.findOneBy({ id });
    if(!programme) {
      throw new NotFoundException(`Programme with id ${id} not found`);
    }
    return programme;
  }

  async findAll() {
    return this.programmeRepository.find();
  }

  async findAllByMachineId(machineId: string) {
    return this.programmeRepository.find({ where: { machine: { id: machineId } } });
  }

  async create(programmeDto: ProgrammeRequestDto) {
    const machine = await this.machinesService.findOne(programmeDto.machineId);
    if(!machine) {
      throw new NotFoundException(`Machine with id ${programmeDto.machineId} not found`);
    }
    return this.programmeRepository.save({ ...programmeDto, machine });
  }

  async update(id: string, programmeDto: ProgrammeRequestDto) {
    await this.findOne(id);
    const machine = await this.machinesService.findOne(programmeDto.machineId);
    if(!machine) {
      throw new NotFoundException(`Machine with id ${programmeDto.machineId} not found`);
    }
    return this.programmeRepository.save({ id, ...programmeDto, machine });
  }
}