const {
  After, AfterAll, Before, BeforeAll,
  Given, When, Then,
  defineParameterType,
  setWorldConstructor
} = require('cucumber')

const RestQapi = require('../src/restqapi')

const config = {
  name: 'local',
  url: 'https://jsonplaceholder.typicode.com',
  performance: {
    tool: 'artillery'
  }
}

const rQapi = new RestQapi(config)

rQapi.setParameterType(defineParameterType)
rQapi.setSteps({ Given, When, Then })
rQapi.setHooks({ Before, BeforeAll, After, AfterAll })

setWorldConstructor(rQapi.getWorld())
