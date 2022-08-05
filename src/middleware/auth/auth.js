const SECRET = process.env.SECRET;
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const { Users } = require('../../models/index');
const jwt = require('jsonwebtoken');

async function validateToken(req, res, next) {
  if (req.headers.authorization.split(' ')[0] === 'Basic') {
    let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
    let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
    let decodedString = base64.decode(encodedString); // "username:password"
    let [username, password] = decodedString.split(':'); // username, password

    const user = await Users.model.findOne({ where: { username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      req.user = user;
    }
  }

  if (req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];

    if (token) {
      const user = jwt.verify(token, SECRET);
      req.user = user;
    }
  }
  next();
}

module.exports = validateToken;
