const got = require('got')
const Request = require('./request')
const Response = require('./response')

const api = function (options) {
  const { config } = options
  const run = async function () {
    try {
      const options = this.request.getOptions()
      //console.log(options)
      // logs.info(options)
      const result = await got(options)
      this.response = new Response(result.restqa)
    } catch (e) {
      // console.log('--------', e)
      // logs.error(e.error)
      if (e.response) {
        // logs.info(e.response)
        this.response = new Response(e.response.restqa)
      } else {
        throw e
      }
    }
  }
  return {
    config,
    request: new Request(config.url),
    response: null,
    run
  }
}

module.exports = api
