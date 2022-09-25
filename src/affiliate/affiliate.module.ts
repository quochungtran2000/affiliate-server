import { Module, HttpModule } from '@nestjs/common';
import { AffiliateController } from './affiliate.controller';
import { AffiliateService } from './affiliate.service';
import { config } from 'src/config/configuration';
// import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
      timeout: 60000,
      headers: {
        Authorization: `Token ${config.accessTrader.accessKey}`,
      },
    }),
  ],
  controllers: [AffiliateController],
  providers: [AffiliateService],
})
export class AffiliateModule {}
