const { World } = require('@restqa/restqa-plugin-boostrap')
const { Api } = require('./lib')

class RestQapiWorld extends World {

  setup () {
    this.apis = this.apis || []
    this.createApi = (url) => {
      const options = {
        config: this._config
      }

      if (url) {
        options.config.url = url
      }

      const api = new Api(options)
      this.apis.push(api)
      return api
    }
  }

}

module.exports = RestQapiWorld
