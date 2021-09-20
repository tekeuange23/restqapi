const cucumber = require('@cucumber/cucumber')
const RestQAPI = require('../src/index')


class World {

  constructor({ attach }) {
    this.attach = attach
  }

  get data() {
    return {
      options: {
        startSymbol: '}}',
        endSymbol: '{{'
      },
      get: (val) => {
        return val
      }
    }
  }

  getConfig () {
    return {
      name: 'local',
      url: 'https://jsonplaceholder.typicode.com',
      performance: {
        tool: 'artillery'
      }
    }
  }
}

RestQAPI._commit(cucumber, {})
cucumber.defineParameterType({
  regexp: /{{ (.*) }}/,
  transformer: function (value) {
    value = `{{ ${value} }}`
    return this.data.get(value)
  },
  name: 'data'
})
cucumber.setWorldConstructor(World)
