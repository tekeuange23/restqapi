const dot = require('dot-object')
const { URL } = require('url')

const Request = function (baseUrl, id) {
  const url = new URL(baseUrl)

  this.options = {
    hostname: url.hostname,
    port: url.port,
    protocol: url.protocol,
    pathname: url.pathname,
    responseType: 'json',
    // strictSSL: false,
    hooks: {
      afterResponse: [
        response => {
          response.restqa = {
            body: response.body,
            timing: response.timings.phases.total,
            headers: response.headers,
            statusCode: response.statusCode,
            request: {
              path: this.options.pathname,
              method: this.options.method,
              prefix: `[${this.options.method.toUpperCase()} ${response.req.path}]`
            }
          }
          return response
        }
      ]
    }
  }

  const getOptions = () => {
    this.options.headers = this.options.headers || {}
    this.options.headers['x-correlation-id'] = getId()
    this.options.headers['user-agent'] = 'restqa (https://github.com/restqa/restqa)'
    return this.options
  }

  const getId = () => {
    if (!id) {
      id = ['test-e2e', this.options.method, Math.floor(Math.random() * 1000), Date.now()].join('-')
    }
    return id
  }

  const setPath = path => {
    if (this.options.pathname === '/') this.options.pathname = ''
    this.options.pathname += path
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
