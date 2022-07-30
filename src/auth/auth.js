'use strict';
const express = require('express');
const User = require('../models/users/model.js');



const router = express.Router();


router.post('/signup', createUser);

//Middleware SignIn
router.post('/signin', signInUser);


//Creates a user
async function createUser(req, res) {
  console.log('???:');
  try {

    const record = await User.create(req.body);
    res.status(201).json(record);
  } catch (e) {
    console.log('ERROR!!;', e);
    res.status(403).send('Error Creating User');
  }

}

//User signin
async function signInUser(req, res, next) {
  console.log('ERROR SIGNIN');

  try {
    const user = await User.authenticate(req, res, next);
    console.log('THIS IS THE USER:', user);
    res.status(200).json(user);




  } catch (error) { next(new Error('Invalid Login!')); }
}




module.exports = router;
