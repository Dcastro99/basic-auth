'use strict';
const SECRET = process.env.SECRET;
const express = require('express');
const jwt = require('jsonwebtoken');
const { Users } = require('../../models/index.js');



const router = express.Router();


//Creates a user
async function createUser(req, res) {

  try {

    const record = await Users.create(req.body);
    res.status(201).json(record);

  } catch (e) {
    res.status(500).send(`Error Creating User ${req.body.username}`);
  }
}


//User signin
async function signInUser(req, res, next) {

  try {
    res.status(200).json({ user: req.user });
  } catch (error) {

    res.status(500).send(`Cannot create user ${req.body.username}`);
  }
}

router.get('/secret', (req, res, next) => {

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];

    if (jwt.verify(token, SECRET)) {
      res.send(token);
      return;
    }
  }
  res.send('bad');

});
router.post('/signup', createUser);

//Middleware SignIn
router.post('/signin', signInUser);


module.exports = router;
