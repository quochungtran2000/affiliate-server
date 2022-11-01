import { createConnection } from 'typeorm';
import { DB_CON_TOKEN } from './database.constant';
import { config } from '../config/configuration';
import { USER } from 'src/models/entities/user';
import { MESSENGER } from 'src/messenger/entities/messenger.entity';
import { MERCHANT } from 'src/affiliate/entities/merchant.entity';

export const databaseProviders = [
  {
    provide: DB_CON_TOKEN,
    useFactory: async () => {
      const MONGO_USER = config.database.user || '';
      const MONGO_PASSWORD = config.database.password || '';
      const MONGO_DATABASE = config.database.dbName || '';
      const MONGO_HOST = config.database.host || '';
      const MONGO_PORT = config.database.port || '27017';
      return await createConnection({
        type: 'mongodb',
        url: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}`,
        entities: [USER, MESSENGER, MERCHANT],
        useUnifiedTopology: true,
        useNewUrlParser: true,
        port: Number(MONGO_PORT),
        // synchronize: true,
        // logging: true,
      });
    },
  },
];
