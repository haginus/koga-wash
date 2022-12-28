import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MachineRequestDto } from "./dto/machine-request.dto";
import { MachinesService } from "./machines.service";
import { ProgrammesService } from "./programmes.service";

@Controller("machines")
export class MachinesController {
  constructor(
    private readonly machinesService: MachinesService,
    private readonly programmesService: ProgrammesService,
  ) {}

  @Get()
  async findAll() {
    return this.machinesService.findAll();
  }

  @Post()
  async create(@Body() createMachineDto: MachineRequestDto) {
    return this.machinesService.create(createMachineDto);
  }

  @Get(":id/programmes")
  async findProgrammes(@Param("id") id: string) {
    return this.programmesService.findAllByMachineId(id);
  }
}