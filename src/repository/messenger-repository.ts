import { Inject, Injectable, Logger } from '@nestjs/common';
import { MESSENGER } from 'src/messenger/entities/messenger.entity';
import { Repository } from 'typeorm';
@Injectable()
export class MessengerRepo {
  private readonly logger = new Logger(`User.${MessengerRepo.name}`);

  constructor(
    @Inject('MESSENGER_REPOSITORY')
    private readonly messengerRepository: Repository<MESSENGER>,
  ) {}

  async getMessage(key) {
    try {
      this.logger.log(`${this.getMessage.name} KEY: ${key}`);
      return await this.messengerRepository.findOne({ active: true, key: key });
    } catch (error) {
      this.logger.error(`${this.getMessage.name} ${error.message}`);
    }
  }
}
