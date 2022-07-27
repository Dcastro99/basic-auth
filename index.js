'use strict';

require('dotenv').config();
const port = process.env.PORT ?? 3000;

const server = require('./src/server.js');
server.start(port);
