//const unirest = require('unirest')
const got = require('got')
const { URL } = require('url')

module.exports = function (config, result) {
  const url = new URL(config.url)
  let options = {
    hostname: url.hostname,
    port: url.port,
    protocol: url.protocol,
    pathname: url.pathname,
    method: config.method,
    responseType: 'json',
    json: result
  }
 return got(options)
    .then(res => {
      console.log(res.statusCode)
    })
}

