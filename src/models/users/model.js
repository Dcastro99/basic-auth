const bcrypt = require('bcrypt');
const base64 = require('base-64');

// const Users = require('./models/auth/user.js');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/dcastro');



const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

//From sequelize Docs
User.beforeCreate(async (user, options) => {
  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;
});

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

User.authenticate = async function (req, res, next) {
  console.log('authenticate');
  let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
  let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password

  const user = await User.findOne({ where: { username } });



  const valid = await bcrypt.compare(password, user.password);
  if (valid) {

    return user;

  } else {
    console.log('ERROR NEXT');
    next(new Error('Invalid User!'));
  }

};

// this creates databse table with column names
User.sync();

module.exports = User;
