import { Injectable } from '@nestjs/common';
import { CreateMessengerDto } from './dto/create-messenger.dto';
import { UpdateMessengerDto } from './dto/update-messenger.dto';

@Injectable()
export class MessengerService {
  create(createMessengerDto: CreateMessengerDto) {
    return 'This action adds a new messenger';
  }

  findAll() {
    return `This action returns all messenger`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messenger`;
  }

  update(id: number, updateMessengerDto: UpdateMessengerDto) {
    return `This action updates a #${id} messenger`;
  }

  remove(id: number) {
    return `This action removes a #${id} messenger`;
  }
}
