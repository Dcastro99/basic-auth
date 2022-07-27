'use strict';

const express = require('express');
const { logger } = require('./middleware/logger');

const { hello } = require('./handler/hello');
const { data } = require('./handler/data');
const { validate } = require('./middleware/validator');
const { do404 } = require('./handler/404');
const { do500 } = require('./handler/500');
const { getPerson } = require('./handler/person');
const { createUser, listUsers, getUser } = require('./handler/user');
const { db } = require('./db');

const makeError = () => {
  throw new Error('This is the error generator!');
};

const pet = (req, res) => {
  res.status(200).send({ name: req.params.name });
};

const app = express();

app.use(logger);
app.use(express.json());

app.get('/', hello);
app.get('/data', data);
app.get('/throw-error', makeError);
app.get('/pets/:name', validate, pet);
app.get('/person/:name', validate, getPerson);

app.get('/user', listUsers);
app.post('/user', createUser);
app.get('/user/:id', getUser);

app.use(do404);
app.use(do500);

// ---
const shouldSyncOnStart = true;
async function start(port) {
  if (shouldSyncOnStart /* todo define this somewhere */) {
    await db.sync();
  }
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

module.exports = {
  app,
  start,
};
