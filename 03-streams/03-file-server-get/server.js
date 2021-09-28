const http = require('http');
const path = require('path');
const fs = require('fs');
const answerHandler = require('./answerHandler');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname === '' || pathname.includes('/')) {
        return answerHandler(400, 'Not Found', res);
      } else {
        const stream = fs.createReadStream(filepath);
        stream.pipe(res);
        stream.on('error', (err) => {
          if (err.code === 'ENOENT') {
            return answerHandler(404, 'Not Found', res);
          } else {
            return answerHandler(500, 'Internal Server Error', res);
          }
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
