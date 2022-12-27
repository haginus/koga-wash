import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { MachinesService } from "./machines.service";

@Controller("machines")
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  async findAll() {
    return this.machinesService.findAll();
  }

  @Post()
  async create(@Body() createMachineDto: CreateMachineDto) {
    return this.machinesService.create(createMachineDto);
  }

  @Get("/programmes/:id")
  async findProgrammeById(@Param("id") id: string) {
    return this.machinesService.findProgrammeById(id);
  }
}