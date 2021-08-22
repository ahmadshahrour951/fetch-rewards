const express = require('express');
const logger = require('morgan');

const app = express();

app.use(express.json());
app.use(logger('dev'));

const PORT = 3000;

app.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Hello World!' });
});

app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});
