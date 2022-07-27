const data = (req, res) => {
  // console.log(Date.now(), req.url);
  res.status(200).send({
    name: 'David',
    role: 'Instructor',
  });
};

module.exports = {
  data,
};
