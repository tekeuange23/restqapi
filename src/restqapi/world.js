const { Api, Data } = require('./lib')

class World {

   constructor({attach, parameters}) {
     this.attach = attach
     this.parameters = parameters

     this.skipped = false
     this._config = {}
     this._apis = []
     this._data = null
   }

   setConfig(config) {
     this._config = config
     this._data = new Data(config.data)
     if (config.secrets) {
       Object.keys(config.secrets).forEach(key => this._data.set(key, config.secrets[key]))
     }
   }

   getConfig() {
     return this._config
   }

   createApi() {
     const options = {
       config: this._config,
       //logs
     }
     const api = new Api(options)
     this._apis.push(api)
     return api
   }

   get data() {
     return this._data
   }

   get apis() {
     return this._apis
   }

}

module.exports = World
