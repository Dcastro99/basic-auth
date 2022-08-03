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
    // console.log(record);
    res.status(201).json(record);

  } catch (e) {
    // console.log('ERROR', e);
    res.status(500).send(`Error Creating User ${req.body.username}`);
  }
}




//User signin
async function signInUser(req, res, next) {
  // console.log(Users.model.authenticate);

  try {
    const user = await Users.model.authenticate(req, res, next);

    // console.log('THIS IS THE USER:', user.username);
    res.status(200).json({ user });

  } catch (error) {
    console.log('errorororor ', error);
    next(new Error('Invalid Login!'));
  }

}

router.get('/secret', (req, res) => {


  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    //next we shouljd use the token to do something, either authorize, or check against users token in db??
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
