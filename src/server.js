const express = require('express');
const logger = require('morgan');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(logger('dev'));
app.use('/', routes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});
