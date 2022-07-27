function do500(err, req, res) {
  res
    .status(500)
    .body(`Handling ${req.path}, there was an exception ${err.message}`);
}

module.exports = {
  do500,
};
