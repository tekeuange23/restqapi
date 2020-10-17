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

  Before(async function (scenario) {
    this.debug = this.debug || []
    this.setConfig(config)
    if (this.data && config.data) {
      await this.data.parse(scenario)
    }
  })

  Before('@skip', function () {
    this.skipped = true
    return 'skipped'
  })

  Before('@wip', function () {
    this.skipped = true
    return 'skipped'
  })

  After(function (scenario) {
    this.log = this.log || console.log
    if (this.debug.length) {
      this.log(`\n======================== [ DEBUG : ${scenario.pickle.name} ] ========================`)
      this.debug.forEach(item => {
        if (typeof item === 'object') item = JSON.stringify(item, null, 2)
        this.log(item)
      })
      this.log('======================== [ / DEBUG ] ========================')
    }
    const attachements = {
      apis: this.apis.map(_ => _.toJSON())
    }
    this.attach(JSON.stringify(attachements), 'application/json')
  })
}
