const SECRET = process.env.SECRET;
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const jwt = require('jsonwebtoken');
const HASH_STRENGTH = 10;

// const Users = require('./models/auth/user.js');
// const { Sequelize, DataTypes } = require('sequelize');




const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        const payload = { username: this.username, role: this.role };
        console.log('MYCODE', SECRET);
        return jwt.sign(payload, SECRET);
      },

    },

  });


  //From sequelize Docs
  model.beforeCreate(async (user, options) => {
    // console.log('GOT HERE');
    const hashedPassword = await bcrypt.hash(user.password, HASH_STRENGTH);
    user.password = hashedPassword;
    user.role = 'user';
  });

  // async function hashPassword(password) {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   return hashedPassword;
  // }


  model.authenticate = async function (req, res, next) {
    try {
      console.log('authenticate');
      let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
      let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
      let decodedString = base64.decode(encodedString); // "username:password"
      let [username, password] = decodedString.split(':'); // username, password

      // console.log('data: username', username, password);
      const user = await model.findOne({ where: { username } });
      // console.log('BOB WAS HERE', user);
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {

        res.status(200).send({ user: user.username, token: user.token });
        return;
      }
    } catch (e) {
      // console.log('WHAT!!!', e);
    }
    // console.log('WERE HERE');
    res
      .status(403)
      .send(
        'Invalid username/password. Too bad we don\'t have an account recovery mechanism.',
      );
  };
  return model;
};


module.exports = userModel;
