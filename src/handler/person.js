function getPerson(req, res) {
  res.status(200).send({ name: req.params.name });
}

module.exports = {
  getPerson,
};
