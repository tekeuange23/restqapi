const {
  After, AfterAll, Before, BeforeAll,
  Given, When, Then,
  defineParameterType,
  setWorldConstructor
} = require('cucumber')

const RestQapi = require('./restqapi')

let config = module.exports = {
  name: 'local',
  url: 'http://host.docker.internal:8080',
  secrets: {
    'api-key': 'xxx-yyy-zzz'
  },
  data: {
    channel: 'google-sheet',
    config: {
      id: process.env.GOOGLE_SHEET_ID,
      apikey: process.env.GOOGLE_SHEET_APIKEY
    },
    startSymbol: '{[',
    endSymbol: ']}'
  }
}

const rQapi = new RestQapi(config)

rQapi.setParameterType(defineParameterType)
rQapi.setSteps({ Given, When, Then })
rQapi.setHooks({ Before, BeforeAll, After, AfterAll })

setWorldConstructor(rQapi.getWorld())
