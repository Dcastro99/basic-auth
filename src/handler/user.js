const { User } = require('../db');

const createUser = async (req, res) => {
  const { username, birthday } = req.body;

  const user = User.build({ username, birthday });

  await user.save();

  res.status(200).send(user);
};

const listUsers = async (req, res) => {
  const users = await User.findAll();

  res.status(200).send(users);
};

const getUser = async (req, res) => {
  const users = await User.findAll({
    where: {
      id: req.params.id,
    },
  });

  if (users.length > 0) {
    res.status(200).send(users[0]);
  } else {
    res.status(404).send(`Could not find user with id ${req.params.id}`);
  }
};

module.exports = {
  createUser,
  listUsers,
  getUser,
};
