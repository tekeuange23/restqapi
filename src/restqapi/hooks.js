const Performance = require('./lib/performance')
const path = require('path')

module.exports = function (config, { Before, BeforeAll, After, AfterAll }) {
  Before(async function (scenario) {
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

  Before('@insecure', function () {
    this.insecure = true
  })

  if (config.performance) {
    config.performance.outputFolder = config.performance.outputFolder || path.resolve(process.cwd(), 'tests', 'performance')
    config.performance.onlySuccess = (config.performance.onlySuccess === undefined) ? true : Boolean(config.performance.onlySuccess)
    const perf = Performance(config.performance)

    After('@performance', function (scenario) {
      perf.add(this.apis, scenario) && this.attach('Generate performance test scenario')
    })
    AfterAll(function () {
      perf.generate()
    })
  }

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
