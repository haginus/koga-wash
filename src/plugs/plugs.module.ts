import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PlugsService } from './plugs.service';
import { PlugsController } from './plugs.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { MachinesModule } from 'src/machines/machines.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('gateway.url'),
        headers: {          
          'Authorization': 'Basic ' + configService.get('gateway.secret'),
        },
      }),
      inject: [ConfigService]
    }),
    MachinesModule,
  ],
  providers: [PlugsService],
  controllers: [PlugsController],
  exports: [PlugsService],
})
export class PlugsModule {}
