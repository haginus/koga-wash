import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { DeviceDto } from './dto/device.dto';
import { EnergyUsageDto } from './dto/energy-usage.dto';

@Injectable()
export class PlugsService {
  constructor(private readonly httpService: HttpService) {}

  async findAll() {
    const { data } = await firstValueFrom(
      this.httpService.get<DeviceDto[]>("/").pipe(
        catchError(() => {
          throw new BadGatewayException("Nu s-a putut comunica cu gateway-ul.");
        }),
      ),
    );
    return data;
  }

  async findOne(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<DeviceDto>(`/${id}`).pipe(
        catchError(() => {
          throw new BadGatewayException("Nu s-a putut comunica cu gateway-ul.");
        }),
      ),
    );
    return data;
  }

  async turnOn(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<DeviceDto>(`/${id}/on`).pipe(
        catchError(() => {
          throw new BadGatewayException("Priza nu a putut fi pornită.");
        }),
      ),
    );
    return data;
  }

  async turnOff(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<DeviceDto>(`/${id}/off`).pipe(
        catchError(() => {
          throw new BadGatewayException("Priza nu a putut fi oprită.");
        }),
      ),
    );
    return data;
  }

  async getEnergyUsage(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<EnergyUsageDto>(`/${id}/energy-usage`).pipe(
        catchError(() => {
          throw new BadGatewayException("Nu s-a putut comunica cu gateway-ul.");
        }),
      ),
    );
    return data;
  }
}
