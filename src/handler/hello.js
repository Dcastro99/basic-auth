const hello = (req, res) => {
  // console.log(Date.now(), req.url);
  res.status(200).send('Hello, World');
};

module.exports = {
  hello,
};
