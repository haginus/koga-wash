import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
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
  async create(@Body() machineInstanceDto: MachineInstanceRequestDto) {
    return this.machineInstacesService.create(machineInstanceDto);
  }

  @Put(":id")
  @Roles(Role.Admin)
  async update(@Param("id") id: string, @Body() machineInstanceDto: MachineInstanceRequestDto) {
    return this.machineInstacesService.update(id, machineInstanceDto);
  }

  @Delete(":id")
  @Roles(Role.Admin)
  async delete(@Param("id") id: string) {
    return this.machineInstacesService.delete(id);
  }

}