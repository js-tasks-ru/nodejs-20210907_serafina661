const http = require('http');
const path = require('path');
const answerHandler = require('../03-file-server-get/answerHandler');
const fs = require('fs');
const LimitSizeStream = require('../01-limit-size-stream/LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      function destroyandUnlink(stream) {
        stream.destroy();
        fs.unlink(filepath, () => {
        });
      }
      if (pathname === '' || pathname.includes('/')) {
        return answerHandler(400, 'Not Found', res);
      } else {
        const limitedStream = new LimitSizeStream({
          limit: 1000000,
        });

        const stream = fs.createWriteStream(filepath, {flags: 'wx'});
        req.pipe(limitedStream).pipe(stream);

        req.on('data', () => {});

        req.on('aborted', () => {
          destroyandUnlink(stream);
        });

        stream.on('finish', () => {
          return answerHandler(201, 'Created', res);
        });
        stream.on('error', (err) => {
          if (err.code === 'EEXIST') {
            return answerHandler(409, 'Conflict: File already exists', res);
          }
          return answerHandler(500, 'Internal Server Error', res);
        });

        limitedStream.on('error', (err) => {
          if (err.code === 'LIMIT_EXCEEDED') {
            answerHandler(413, 'Request Entity Too Large', res);
          } else {
            answerHandler(500, 'Internal Server Error', res);
          }
          destroyandUnlink(stream);
        });
      }
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
