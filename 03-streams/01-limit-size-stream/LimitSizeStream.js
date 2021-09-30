const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.dataSize = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.dataSize += Buffer.byteLength(chunk);
    return this.dataSize > this.limit ?
      callback(new LimitExceededError) :
      callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
