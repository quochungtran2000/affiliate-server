import { Module, HttpModule } from '@nestjs/common';
import { AffiliateController } from './affiliate.controller';
import { AffiliateService } from './affiliate.service';
import { config } from 'src/config/configuration';
import { MerchantRepo } from 'src/repository/merchant-repository';
import { merchantProviders } from 'src/providers/merchant-providers';
import { DatabaseModule } from 'src/database';
// import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DatabaseModule,
    HttpModule.register({
      maxRedirects: 5,
      timeout: 60000,
      headers: {
        Authorization: `Token ${config.accessTrader.accessKey}`,
      },
    }),
  ],
  controllers: [AffiliateController],
  providers: [AffiliateService, MerchantRepo, ...merchantProviders],
})
export class AffiliateModule {}
