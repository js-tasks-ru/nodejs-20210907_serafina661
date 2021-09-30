const http = require('http');
const path = require('path');
const answerHandler = require('../03-file-server-get/answerHandler');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname === '' || pathname.includes('/')) {
        return answerHandler(400, 'Not Found', res);
      } else {
        fs.unlink(filepath, (err) => {
          if (err) {
            if (err.code === 'ENOENT') {
              return answerHandler(404, 'Not Found', res);
            }
            return answerHandler(500, 'Internal Server Error', res);
          }
          return answerHandler(200, 'File has been deleted', res);
        });
      }
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
