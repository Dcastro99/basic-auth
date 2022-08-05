'use strict';

require('dotenv').config();
const port = process.env.PORT ?? 3001;
console.log('PORT!!', port);
const server = require('./src/server.js');
const { db } = require('./src/models/index.js');
const { seed } = require('./src/models/seed');

db.sync()
  .then(async () => {
    if (process.env.NODE_ENV === 'dev') {
      await db.sync({ force: false });
      // await seed();
    }
    server.start(port);
  })
  .catch(console.error);
