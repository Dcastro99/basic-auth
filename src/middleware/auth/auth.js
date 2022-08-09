const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {
  const token = req.headers['authorization'];
  // console.log("token is : ", token);
  if (token) {
    try {
      const user = jwt.verify(token, SECRET);
      req.user = user;
    } catch (e) {
      // console.log("Eeek ", e);
      // Failed to validate the user, oh well
    }
  }
  next();
}

module.exports = validateToken;


