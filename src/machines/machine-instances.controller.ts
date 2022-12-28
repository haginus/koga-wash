import { Body, Controller, Get, Post } from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/role.enum";
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
  @Roles(Role.Admin)
  async create(@Body() createMachineInstanceDto: MachineInstanceRequestDto) {
    return this.machineInstacesService.create(createMachineInstanceDto);
  }
}