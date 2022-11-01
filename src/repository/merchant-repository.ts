import { Inject, Injectable, Logger } from '@nestjs/common';
import { MERCHANT } from 'src/affiliate/entities/merchant.entity';
import { Repository } from 'typeorm';
@Injectable()
export class MerchantRepo {
  private readonly logger = new Logger(`${MerchantRepo.name}`);

  constructor(
    @Inject('MERCHANT_REPOSITORY')
    private readonly merchantRepository: Repository<MERCHANT>,
  ) {}

  async getMerchants() {
    try {
      this.logger.log(`${this.getMerchants.name} called`);
      return await this.merchantRepository.findAndCount({
        where: { active: true },
      });
    } catch (error) {
      this.logger.error(`${this.getMerchants.name} ${error.message}`);
    }
  }
}
