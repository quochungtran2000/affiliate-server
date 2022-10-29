import { HttpModule, Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';
import { DatabaseModule } from 'src/database';
import { MessengerRepo } from 'src/repository/messenger-repository';
import { messengerProviders } from 'src/providers/messenger-providers';

@Module({
  imports: [
    DatabaseModule,
    HttpModule.register({
      maxRedirects: 5,
      timeout: 60000,
    }),
  ],
  controllers: [MessengerController],
  providers: [MessengerService, MessengerRepo, ...messengerProviders],
})
export class MessengerModule {}
