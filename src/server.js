if (process.env.NODE_ENV !== 'production') require('dotenv-safe').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');

const routes = require('./routes');
const db = require('./db/models');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(logger('dev'));

app.use('/', routes);

const PORT = 3000;

const testDbConnection = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('PostgreSQL successfully connected.');
  } catch (err) {
    console.error.bind(console, 'MongoDB connection error:', err);
  }
};

const serverListen = async () => {
  try {
    await app.listen(PORT);
    console.log('Server listening on Port', PORT);
  } catch (err) {
    console.error.bind(console, 'Server setup error:', err);
  }
};

const initServer = async () => {
  await testDbConnection();
  await serverListen();
};

initServer();

module.exports = app;
