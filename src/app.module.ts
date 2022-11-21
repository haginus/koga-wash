import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { MachinesModule } from './machines/machines.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/koga-wash'),
    UsersModule,
    MachinesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
