/*
 * @Author: dali
 * @Date: 2019-01-24 18:46:16
 * @Last Modified by: dali
 * @Last Modified time: 2019-01-24 18:56:54
 */
const connect = require('connect')
const url = require('url')

const app = connect()
  .use(rewrite)
  .use(geturl)
  .listen(3000, _ => {
    console.log('server run 3000!~')
  })

//rewrite,重写url
function rewrite(req, res, next) {
  const path = url.parse(req.url).pathname
  let match = path.match(/^\/blog\/posts\/(.+)/)
  if (match) {
    // 此处查找是否真的有这个用户
    let id = 'nishizhu22'
    req.url = '/blog/posts/' + id
    next()
  } else {
    next()
  }
}

// 一个获取url的函数
function geturl(req, res, next) {
  console.log(req.url)
  next()
}
