/*
 * black 2019/1/24
 * connect组件
 * */
const connect = require('connect');
let router = require('./router').router;

let routes = {
  GET: {
    '/users': (req, res) => {
      res.end('tobi,loki,ferret');
    },
    '/users/:id': (req, res, id) => {
      res.end('user' + id);
    }
  },
  DELETE: {
    '/users/:id': (req, res, id) => {
      res.end('deleted user' + id)
    }
  }
};

connect()
  .use(router(routes))
  .listen(3000, _ => {
    console.log('server run 3000!~~')
  });