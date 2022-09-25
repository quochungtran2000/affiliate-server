// import { DataSource } from 'typeorm';
// import { config } from '../config/configuration';
// import { USER } from 'src/models/entities/user';

// const MONGO_USER = config.database.user || '';
// const MONGO_PASSWORD = config.database.password || '';
// const MONGO_DATABASE = config.database.dbName || '';
// const MONGO_HOST = config.database.host || '';
// const MONGO_PORT = config.database.port || '27017';

// const AppDataSource = new DataSource({
//   type: 'mongodb',
//   url: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}`,
//   entities: [USER],
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   port: Number(MONGO_PORT),
// });

// export default AppDataSource;
export { DatabaseModule } from './database.module';
