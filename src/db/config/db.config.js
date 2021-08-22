////////////////////////////////////////////////////////////////////////////////////////
// Config options for database.
/////////////////////////////////////////////////////////////////////////////////////////
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: 'fetchrewards_development',
    dialect: 'postgres',
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: 'fetchrewards_test',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: 'fetchrewards_production',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
  },
};
