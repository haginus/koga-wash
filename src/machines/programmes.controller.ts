import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/role.enum";
import { ProgrammeRequestDto } from "./dto/programme-request.dto";
import { ProgrammesService } from "./programmes.service";

@Controller("programmes")
export class ProgrammesController {
  constructor(private readonly programmesService: ProgrammesService) {}

  @Get()
  async findAll() {
    return this.programmesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.programmesService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  async create(@Body() programmeDto: ProgrammeRequestDto) {
    return this.programmesService.create(programmeDto);
  }

  @Put(":id")
  @Roles(Role.Admin)
  async update(@Param("id") id: string, @Body() programmeDto: ProgrammeRequestDto) {
    return this.programmesService.update(id, programmeDto);
  }

  
}