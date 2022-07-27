const sequelize = require('sequelize');

function user(db) {
  return db.define('User', {
    username: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    birthday: {
      type: sequelize.DataTypes.DATE,
      validate: {
        is21(value) {
          return value <= new Date(2001);
        },
      },
    },
  });
}

module.exports = { user };
