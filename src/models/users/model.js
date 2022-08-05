const SECRET = process.env.SECRET;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HASH_STRENGTH = 10;


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
    user.role = 'user';
  });


  return model;
};


module.exports = userModel;
