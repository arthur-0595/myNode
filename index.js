const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const handlebars = require('handlebars')
const zlib = require('zlib')

const mime = require('./states/mime.json')

const public_folder = path.join(__dirname, 'node_modules')

let server = http.createServer((req, res) => {

  let pathName = url.parse(req.url).pathname;
  let realPath = path.join(public_folder, pathName);

  fs.stat(realPath, (err, stats) => {
    // 如果文件不存在，则返回404
    if (err) {
      res.writeHead(404, {
        'Content-Type': 'text/html'
      })
      let templateStr = fs.readFileSync('./template/404.html')
      let template = handlebars.compile(templateStr.toString())
      let data = {
        path: url.parse(req.url).pathname
      }
      res.end(template(data))
    } else {
      if (stats.isDirectory()) {
        let templateStr = fs.readFileSync('./template/dirList.html')
        let template = handlebars.compile(templateStr.toString())
        let data = {
          path: path.join(pathName, '/'),
          title: url.parse(req.url).pathname,
          files: fs.readdirSync(realPath)
        }
        res.writeHead(200, {
          'Content-Type': 'text/html'
        })
        res.end(template(data))
      } else {
        let extension = path.extname(pathName);
        let fileType = mime[extension] || 'text/plain'

        let acceptEncoding = req.headers['accept-encoding'] || '';
        let compressable = extension.match(/css|js|html|json|xml|md|text/ig)

        res.statusCode = 200;
        res.setHeader('Content-Type', fileType)

        if (compressable && acceptEncoding.match(/\bgzip\b/)) {
          res.setHeader('Content-Encoding', 'gzip')
          fs.createReadStream(realPath)
            .pipe(zlib.createGzip())
            .pipe(res)
        } else if (compressable && acceptEncoding.match(/\bdeflate\b/)) {
          res.setHeader('Content-Encoding', 'deflate')
          fs.createReadStream(realPath)
            .pipe(zlib.createDeflate())
            .pipe(res)
        } else {
          fs.createReadStream(realPath)
            .pipe(res)
        }
      }

    }
  })
})
server.listen(process.argv[2] || 8080)