import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DevGuard } from 'src/auth/guards/dev.guard';
import { MailModule } from 'src/mail/mail.module';
import { DevController } from './dev.controller';

@Module({
  controllers: [DevController],
  imports: [MailModule],
  providers: [
    { provide: APP_GUARD, useClass: DevGuard }
  ],
})
export class DevModule {}
