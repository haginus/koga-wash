import { Body, Controller, Get, Post } from "@nestjs/common";
import { MachineInstanceRequestDto } from "./dto/machine-instance-request.dto";
import { MachineInstancesService } from "./machine-instances.service";

@Controller("instances")
export class MachineInstancesController {
  constructor(private readonly machineInstacesService: MachineInstancesService) {}

  @Get()
  async findAll() {
    return this.machineInstacesService.findAll();
  }

  @Post()
  async create(@Body() createMachineInstanceDto: MachineInstanceRequestDto) {
    return this.machineInstacesService.create(createMachineInstanceDto);
  }
}