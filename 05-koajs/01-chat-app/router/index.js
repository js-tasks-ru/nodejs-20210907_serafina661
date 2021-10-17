const Router = require('koa-router');
const router = new Router();

let promiseList = [];

router.get('/subscribe', async (ctx) => {
  try {
    ctx.body = await new Promise((resolve) => {
      promiseList.push((message) => resolve(message));
    });
    ctx.status = 200;
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = 'Internal Error';
  }
});

router.post('/publish', async (ctx) => {
  try {
    const message = ctx.request.body.message;
    if (message) {
      promiseList.forEach((resolve) => {
        resolve(message);
      });
      promiseList = [];
      ctx.status = 200;
      ctx.body = message;
    }
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = 'Internal Error';
  }
});

module.exports = router;
