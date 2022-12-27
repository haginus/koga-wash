import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateMachineInstanceDto } from "./dto/create-machine-instance.dto";
import { MachineInstancesService } from "./machine-instances.service";

@Controller("instances")
export class MachineInstancesController {
  constructor(private readonly machineInstacesService: MachineInstancesService) {}

  @Get()
  async findAll() {
    return this.machineInstacesService.findAll();
  }

  @Post()
  async create(@Body() createMachineInstanceDto: CreateMachineInstanceDto) {
    return this.machineInstacesService.create(createMachineInstanceDto);
  }
}