var fs = require('fs')

fs.readFile('./text.md', (err, data) => {
  if (err) {
    console.log(err);
    return false
  }
  console.log(`异步: \n${data}`);
})

var text = fs.readFileSync('./text.md', 'utf8')

console.log(`同步: \n${text}`);