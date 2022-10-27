import { HttpModule, Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
      timeout: 60000,
    }),
  ],
  controllers: [MessengerController],
  providers: [MessengerService],
})
export class MessengerModule {}
