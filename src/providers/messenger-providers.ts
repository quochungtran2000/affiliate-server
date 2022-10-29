import { MESSENGER } from 'src/messenger/entities/messenger.entity';
import { Connection } from 'typeorm';
import { DB_CON_TOKEN } from '../database/database.constant';

export const messengerProviders = [
  {
    provide: 'MESSENGER_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(MESSENGER),
    inject: [DB_CON_TOKEN],
  },
];
