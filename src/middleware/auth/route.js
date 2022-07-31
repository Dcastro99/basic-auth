'use strict';
const express = require('express');
const { Users } = require('../../models/index.js');


const router = express.Router();




//Creates a user
async function createUser(req, res) {

  try {

    const record = await Users.create(req.body);
    console.log(record);
    res.status(201).json(record);

  } catch (e) {
    console.log('ERROR', e);
    res.status(500).send(`Error Creating User ${req.body.username}`);
  }
}

//User signin
async function signInUser(req, res, next) {
  // console.log(Users.model.authenticate);

  try {
    const user = await Users.model.authenticate(req, res, next);

    // console.log('THIS IS THE USER:', user);
    res.status(200).json({ user: user.username, token: user.token });

  } catch (error) { next(new Error('Invalid Login!')); }

}

router.post('/signup', createUser);

//Middleware SignIn
router.post('/signin', signInUser);


module.exports = router;
