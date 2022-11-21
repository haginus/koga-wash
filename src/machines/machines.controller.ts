import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { MachinesService } from "./machines.service";
import { Machine } from "./schemas/machine.schema";

@Controller("machines")
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  async findAll(): Promise<Machine[]> {
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