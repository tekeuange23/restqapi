const dot = require('dot-object')
const { URL } = require('url')

const Request = function (baseUrl, id) {
  let url = new URL(baseUrl)

  this.options = {
    hostname: url.hostname,
    port: url.port,
    protocol: url.protocol,
    responseType: 'json',
    //strictSSL: false,
    hooks: {
      afterResponse: [
        response => {
          response.restqa = {
            body: response.body,
            timing: response.timings.phases.total,
            headers: response.headers,
            statusCode: response.statusCode
          }
          return response
        }
      ]
    }
    /*
    transform: (body, response) => {
      return {
        body,
        headers: response.headers,
        statusCode: response.statusCode,
        timing: response.timingPhases.total,
        curl: response.request.req.toCurl()
      }
    }
    */
  }

  const getOptions = () => {
    this.options.headers = this.options.headers || {}
    this.options.headers['x-correlation-id'] = getId()
    return this.options
  }

  const getId = () => {
    if(!id) {
      id = [ 'test-e2e', this.options.method, Math.floor(Math.random() * 1000), Date.now()].join('-')
    }
    return id
  }

  const setPath = path => {
    this.options.pathname = path
  }

  const setHeader = (property, value) => {
    this.options.headers = this.options.headers || {}
    this.options.headers[property] = value
  }

  const setQueryString = (property, value) => {
    this.options.searchParams = this.options.searchParams || {}
    this.options.searchParams[property] = value
  }

  const setBearer = token => {
    this.options.auth = {
      bearer: token
    }
  }

  const setMethod = method => {
    this.options.method = method
  }

  const addPayload = (property, value) => {
    this.options.json = this.options.json || {}
    dot.str(property, value, this.options.json)
  }

  const setBaseUrl = baseUrl => {
    this.options.baseUrl = baseUrl
  }

  return {
    getId,
    getOptions,
    setPath,
    setHeader,
    setBearer,
    setMethod,
    addPayload,
    setBaseUrl,
    setQueryString
  }
}

module.exports = Request
