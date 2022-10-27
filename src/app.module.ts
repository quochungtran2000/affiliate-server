import { Module } from '@nestjs/common';
import { AffiliateModule } from './affiliate/affiliate.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database';
import { MessengerModule } from './messenger/messenger.module';

@Module({
  imports: [DatabaseModule, AffiliateModule, MessengerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
