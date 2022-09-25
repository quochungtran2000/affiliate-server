export const config = {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    scheme: process.env.DB_SCHEME,
  },
  env: {
    applications: process.env.APPLICATIONS,
    privateKey: process.env.PRIVATE_KEY,
    port: process.env.PORT,
  },
  accessTrader: {
    accessKey: process.env.ACCESS_KEY,
  },
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGESIZE = 12;
