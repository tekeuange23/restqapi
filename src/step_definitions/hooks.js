const { Before, BeforeAll, After, AfterAll } = require('cucumber')
const Apis = require('../support/apis')
const Utils = require('../support/utils')
const Config = require('../../config')
const { v4: uuidv4 } = require('uuid')
const moment = require('moment')

global.restqa = {}

BeforeAll(function () {
  global.restqa.startTime =  moment().format(),
  global.restqa.uuid = uuidv4()
  global.restqa.env = process.env.RESTQA_ENV && String(process.env.RESTQA_ENV).toLowerCase()
  global.restqa.configFile = process.env.RESTQA_CONFIG
  global.restqa.CONFIG = new Config(global.restqa)

  console.log('Starting Test: ', global.restqa.uuid)
})

Before(async function (scenario) {

  this.CONFIG = global.restqa.CONFIG
  this.logs = Utils.logs(this.parameters['serve-mode'])
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
    //logId : this.logs.getId(),
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
