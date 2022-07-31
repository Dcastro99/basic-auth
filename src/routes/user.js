'use strict';

const express = require('express');

const usersCollection = require('../models/index.js').Users;

// const app = express();

const router = express.Router();

// RESTful Route Declarations

router.get('/users/:id', getOneUsers);
router.post('/users', createUsers);


// RESTful Route Handlers
async function getOneUsers(req, res) {
  let theUsers = await usersCollection.read();
  res.status(200).json(theUsers);
}



async function createUsers(req, res) {
  let obj = req.body;
  let newUsers = await usersCollection.create(obj);
  res.status(200).json(newUsers);
}



module.exports = router;
