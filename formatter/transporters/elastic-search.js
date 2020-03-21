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

  let result = []

  return new Promise((resolve, reject) => {

    const q = $async.queue(function(opt, callback) {
      got(opt)
        .then(res => {
          result.push(`[HTTP ELK][${res.statusCode}] - ${config.url} - index : ${index}`)
          callback()
        })
        .catch(callback)
    }, 5)

    q.error(function(err, task) {
      result.push(`[HTTP ELK][${err.response.statusCode}] - ${config.url} - index : ${index}`)
      console.log(err)
    })

    q.drain(() => {
      resolve(result)
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
  })
}
