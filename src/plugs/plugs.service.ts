import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { DeviceDto } from './dto/device.dto';

@Injectable()
export class PlugsService {
  private readonly gatewayUrl = "http://127.0.0.1:5000/";
  constructor(private readonly httpService: HttpService) {}

  async findAll() {
    const { data } = await firstValueFrom(
      this.httpService.get<DeviceDto[]>(this.gatewayUrl).pipe(
        catchError((error: AxiosError) => {
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
