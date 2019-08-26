import dotenv from 'dotenv';

dotenv.config();
const databaseEnvDetails = {
  username: process.env.DB_CONFIG_USERNAME,
  password: process.env.DB_CONFIG_PASSWORD,
  host: process.env.DB_CONFIG_HOST,
  port: process.env.DB_CONFIG_PORT,
  dialect: 'postgres'
};

const config = {
  development: {
    ...databaseEnvDetails,
    database: process.env.DB_CONFIG_DEV,
  },
  test: {
    database: process.env.DB_CONFIG_TEST,
    ...databaseEnvDetails,
  },
  production: {
    DATABASE_URL: process.env.DATABASE_URL,
  }
};

module.exports = config;
