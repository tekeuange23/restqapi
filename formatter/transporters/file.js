const fs = require('fs')
const path = require('path')

module.exports = function (config, result) {
  let fileName = path.resolve(config.path)
  let output = JSON.stringify(result, null, 2)

  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, output, 'utf8', err => {
      if(err) return reject(`[FILE REPORT][ERROR] - ${config.path} : ${err}`)
        resolve(`[FILE REPORT][SUCCESS] - ${config.path}`)
    })
  })
}

