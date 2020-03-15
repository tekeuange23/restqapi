const { Before, BeforeAll, After, AfterAll } = require('cucumber')
const Config = require('../../config')
const Apis = require('../support/apis')
const Utils = require('../support/utils')


BeforeAll(function () {
  console.log('Starting new script')

})

Before(async function (scenario) {
  this.logs = Utils.logs(this.parameters['serve-mode'])
  this.CONFIG = await Config()
  this.skipped = false

  this.apis = new Apis(this.CONFIG, this.logs.getId())
  this.apis.logs = this.logs
})

Before('@skip', function (scenario, callback) {
  this.skipped = true
  callback(null, 'pending')
})

Before('@wip', function () {
  this.skipped = true
  return 'skipped'
})

After(function () {
  let attachements = {
    logId : this.logs.getId(),
    skipped: this.skipped
  }
  this.attach(JSON.stringify(attachements), 'application/json')
  delete this.apis
  delete this.api
})

AfterAll(function () {
  delete this.apis
  delete this.api
})
