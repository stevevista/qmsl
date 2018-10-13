const fs = require('fs')
const path = require('path')

fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js') {
    require(path.join(__dirname, file))
  }
})
