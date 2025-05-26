const dotenv = require('dotenv');

dotenv.config();

const envVars = {
  SQL_DATABASE: process.env.SQL_DATABASE || 'kaia',
  SQL_USERNAME: process.env.SQL_USERNAME || 'root',
  SQL_PASSWORD: process.env.SQL_PASSWORD || 'root',
  SQL_HOST: process.env.SQL_HOST || 'localhost',
  SQL_PORT: process.env.SQL_PORT || 3306,
  SQL_DIALECT: process.env.SQL_DIALECT || 'mysql',
};

module.exports = {
  rpcUrl: process.env.RPC_URL,
  contractAddress: process.env.CONTRACT,
  db: {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
  },
  sequelize: {
    host: envVars.SQL_HOST,
    port: envVars.SQL_PORT,
    username: envVars.SQL_USERNAME,
    password: envVars.SQL_PASSWORD,
    database: envVars.SQL_DATABASE,
    dialect: envVars.SQL_DIALECT,
  },
};