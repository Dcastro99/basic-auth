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
      unique: {
        args: true,
        messege: 'Username must be unique.',
        fields: [sequelize.fn('lower', sequelize.col('username'))],

      },
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
        return jwt.sign(payload, SECRET);
      },

    },

  });


  //From sequelize Docs
  model.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, HASH_STRENGTH);
    user.password = hashedPassword;
    user.role;
  });



  model.authenticate = async function (req, res, next) {
    try {
      console.log('authenticate', req.headers);
      let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
      let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
      let decodedString = base64.decode(encodedString); // "username:password"
      let [username, password] = decodedString.split(':'); // username, password
      const user = await model.findOne({ where: { username } });
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {

        // res.status(200).send({ user, token: user.token });
        return user;
      }
    } catch (e) {
      // console.log('WHAT!!!', e);
    }

    throw new Error('Invalid username/password. Too bad we don\'t have an account recovery mechanism.');
    // res
    //   .send(
    //     'Invalid username/password. Too bad we don\'t have an account recovery mechanism.',
    //   );
  };

  return model;
};


module.exports = userModel;
