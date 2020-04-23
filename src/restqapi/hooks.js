// const moment = require('moment')
// const { v4: uuidv4 } = require('uuid')

module.exports = function (config, { Before, BeforeAll, After, AfterAll }) {
  /*
  const restqa = {
    uuid: uuidv4(),
    startTime: moment().format(),
    env: String(process.env.RESTQA_ENV).toLowerCase(),
    configFile: process.env.RESTQA_CONFIG
  }
  */

  Before(function () {
    this.setConfig(config)
  })

  Before(async function (scenario) {
    await this.data.parse(scenario)
  })

  Before('@skip', function () {
    this.skipped = true
    return 'skipped'
  })

  Before('@wip', function () {
    this.skipped = true
    return 'skipped'
  })

  After(function () {
    const attachements = {
      apis: this.apis.map(_ => _.toJSON())
    }
    this.attach(JSON.stringify(attachements), 'application/json')
  })
}
