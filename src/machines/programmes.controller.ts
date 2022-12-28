import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
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
  async create(@Body() programmeDto: ProgrammeRequestDto) {
    return this.programmesService.create(programmeDto);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() programmeDto: ProgrammeRequestDto) {
    return this.programmesService.update(id, programmeDto);
  }

  
}