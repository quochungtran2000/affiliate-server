import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';

@Module({
  controllers: [MessengerController],
  providers: [MessengerService],
})
export class MessengerModule {}
