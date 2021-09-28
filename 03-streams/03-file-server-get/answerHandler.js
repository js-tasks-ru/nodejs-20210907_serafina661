function answerHandler(code, message, res) {
  res.statusCode = code;
  return res.end(message);
}

module.exports = answerHandler;
