const dot = require('dot-object')
const flatten = require('g11n-pipeline-flatten');

const Response = function (result) {

  const { curl, statusCode, headers, body, timing } = result
  const dotBody = dot.dot(body || {})
  const jsonPathBody = flatten.flatten(body || {}, {flattenAll: true})

  const findInBody = (property) => {
    let obj = dotBody //default use the dot synthax
    if ('$' === property[0]) obj = jsonPathBody //if $ is the first char we will use jsonpath
    return obj[property]
  }

  const findInHeader = (property) => {
    return headers[property] || headers[property.toLowerCase()]
  }

  return {
    timing,
    statusCode,
    headers,
    body,
    findInBody,
    findInHeader,
    curl
  }
}

module.exports = Response
