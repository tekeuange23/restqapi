const dot = require('dot-object')
const flatten = require('g11n-pipeline-flatten')

const Response = function (result) {
  const { request, statusCode, headers, body, timing } = result

  const isJson = (headers['content-type'] || '' ).match(/application\/json/i)

  let dotBody = {}
  let jsonPathBody = {}

  if (isJson) {
    dotBody = dot.dot(body || {})
    jsonPathBody = flatten.flatten(body || {}, { flattenAll: true })
  }

  const findInBody = (property) => {
    let obj = dotBody // default use the dot synthax
    if (property[0] === '$') obj = jsonPathBody // if $ is the first char we will use jsonpath
    return obj[property]
  }

  const findInHeader = (property) => {
    return headers[property] || headers[property.toLowerCase()]
  }

  return {
    request,
    timing,
    statusCode,
    headers,
    body,
    findInBody,
    findInHeader,
    getResult: () => result
  }
}

module.exports = Response
