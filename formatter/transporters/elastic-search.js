const got = require('got')
const { URL } = require('url')
const moment = require('moment')
const $async = require('async')

module.exports = function (config, testRun) {

  const url = new URL(config.url)
  let index = config.index + '-' + moment().format("YYYYMMDD");  

  let options = {
    hostname: url.hostname,
    port: url.port,
    protocol: url.protocol,
    pathname: `/${index}/_doc`,
    method: 'POST',
    responseType: 'json'
  }

   const q = $async.queue(function(opt, callback) {
       got(opt)
         .then(response => {
           console.log(response.statusCode)
           callback()
         })
         .catch(callback)
   }, 5)

   q.error(function(err, task) {
     console.error(err.response.body);
   })

  let { features } = testRun
  delete testRun.features


  q.push(Object.assign({json: testRun}, options))
  features.forEach(feature => {
    q.push(Object.assign({json: feature}, options))
    scenarios = feature.elements.forEach(scenario => {
      q.push(Object.assign({json: scenario}, options))
    })
  })
}

