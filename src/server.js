const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');

const routes = require('./routes');
const db = require('./db');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(logger('dev'));

app.use('/', routes);

const PORT = 3000;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('MongoDB successfully connected.');
  app.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
  });
});
