'use strict';

// 3rd Party Dependencies (modules)
require('dotenv').config();
const express = require('express');
const cors = require('cors');


// Our own custom modules
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');
const authRoutes = require('./middleware/auth/route.js');
const foodRoutes = require('./routes/food.js');
const clothesRoutes = require('./routes/clothes.js');
const userRoutes = require('./routes/user.js');
// const validateToken = require('./middleware/auth/auth.js');

const app = express();

// Express Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());


// Our own Global Middleware
app.use(logger);
// app.use(validateToken);


// Use our routes from the routing module...
app.use(authRoutes);
app.use(foodRoutes);
app.use(clothesRoutes);
app.use(userRoutes);

// Our Error Handlers -- need to be the last things defined!
// These use the external modules we required above
app.use('*', notFoundHandler);
app.use(errorHandler);

// Export an object with the express app and separate method that can start the server
module.exports = {
  server: app,
  start: (port) => {
    if (!port) {
      throw new Error('Missing Port');
    }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
