import { MERCHANT } from 'src/affiliate/entities/merchant.entity';
import { Connection } from 'typeorm';
import { DB_CON_TOKEN } from '../database/database.constant';

export const merchantProviders = [
  {
    provide: 'MERCHANT_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(MERCHANT),
    inject: [DB_CON_TOKEN],
  },
];
