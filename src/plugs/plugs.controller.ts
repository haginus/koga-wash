import { Controller, Get } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { PlugsService } from './plugs.service';

@Controller('plugs')
@Roles(Role.Admin)
export class PlugsController {

  constructor(private readonly plugsService: PlugsService) {}

  @Get()
  async findAll() {
    return this.plugsService.findAll();
  }
}
