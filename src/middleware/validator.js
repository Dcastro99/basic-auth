function validate(req, res, next) {
  if (req.params['name']) {
    next();
  } else {
    throw new Error('Missing name parameter');
  }
}

module.exports = {
  validate,
};
