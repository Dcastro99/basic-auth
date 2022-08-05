'use strict';
const SECRET = process.env.SECRET;
const express = require('express');
const jwt = require('jsonwebtoken');
const { Users } = require('../../models/index.js');
const validateToken = require('../../middleware/auth/auth.js');


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
    // const user = await Users.model.authenticate(req, res, next);

    console.log('THIS IS THE USER:', req.user);
    ///CHANGING
    res.status(200).json({ user: req.user });
    // res.status(200).json({ user: user.username, token: user.token });


  } catch (error) {
    console.log('errorororor ', error);
    res.status(500).send(`Cannot create user ${req.body.username}`);
  }

}

router.get('/secret', (req, res, next) => {


  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    //next we shouljd use the token to do something, either authorize, or check against users token in db??
    if (jwt.verify(token, SECRET)) {
      res.send(token);
      // console.log('TTTTTOOOOOKKKKEEEEN', token);
      // res.user = user;
      return;
    }
  }
  res.send('bad');

});
router.post('/signup', createUser);

//Middleware SignIn
router.post('/signin', validateToken, signInUser);


module.exports = router;
