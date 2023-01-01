import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PlugsService } from './plugs.service';
import { PlugsController } from './plugs.controller';

@Module({
  imports: [HttpModule],
  providers: [PlugsService],
  controllers: [PlugsController],
})
export class PlugsModule {}
