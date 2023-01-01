import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/role.enum";
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

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.machinesService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createMachineDto: MachineRequestDto) {
    return this.machinesService.create(createMachineDto);
  }

  @Put(":id")
  @Roles(Role.Admin)
  async update(@Param("id") id: string, @Body() updateMachineDto: MachineRequestDto) {
    return this.machinesService.update(updateMachineDto);
  }

  @Get(":id/programmes")
  async findProgrammes(@Param("id") id: string) {
    return this.programmesService.findAllByMachineId(id);
  }
}