import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { DeviceDto } from './dto/device.dto';

@Injectable()
export class PlugsService {
  private readonly gatewayUrl = "http://127.0.0.1:5000";
  constructor(private readonly httpService: HttpService) {}

  async findAll() {
    const { data } = await firstValueFrom(
      this.httpService.get<DeviceDto[]>(this.gatewayUrl).pipe(
        catchError(() => {
          throw new BadGatewayException("Nu s-a putut comunica cu gateway-ul.");
        }),
      ),
    );
    return data;
  }

  async findOne(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<DeviceDto>(`${this.gatewayUrl}/${id}`).pipe(
        catchError(() => {
          throw new BadGatewayException("Nu s-a putut comunica cu gateway-ul.");
        }),
      ),
    );
    return data;
  }

  async turnOn(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<DeviceDto>(`${this.gatewayUrl}/${id}/on`).pipe(
        catchError(() => {
          throw new BadGatewayException("Priza nu a putut fi pornită.");
        }),
      ),
    );
    return data;
  }

  async turnOff(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<DeviceDto>(`${this.gatewayUrl}/${id}/off`).pipe(
        catchError(() => {
          throw new BadGatewayException("Priza nu a putut fi oprită.");
        }),
      ),
    );
    return data;
  }
}