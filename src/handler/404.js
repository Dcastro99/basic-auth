function do404(req, res) {
  res.status(404).send(`404 not found: ${req.url}`);
}

module.exports = {
  do404,
};
