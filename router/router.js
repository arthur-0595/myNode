/*
 * black 2019/1/24
 * router中间件
 * */
const URL = require('url');

exports.router = function (obj) {
  return function (req, res, next) {
    // 先看下该请求方法是否已定义
    if (!obj[req.method]) {
      next();
      return
    }
    let routes = obj[req.method];
    let url = URL.parse(req.url);
    // Object.keys() 返回一个所有元素为字符串的数组，其元素来自于从给定的object上面可直接枚举的属性。这些属性的顺序与手动遍历该对象属性时的一致。
    let paths = Object.keys(routes);
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      let fn = routes[path];
      // 处理url，用来和正则匹配
      path = path.replace(/\//g, '\\/').replace(/:(\w+)/g, '([^\\/]+)');
      let re = new RegExp('^' + path + '$');
      let captures = url.pathname.match(re);
      if (captures) {
        let args = [req, res].concat(captures.slice(1));
        fn.apply(null, args);
        return;
      }
      next()
    }
  }
};