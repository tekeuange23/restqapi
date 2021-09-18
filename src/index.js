const RestQAPlugin = require('@restqa/plugin')
const RestQAPI = require('./restqapi')

const plugin = new RestQAPlugin(RestQAPI.name)

// Setup Steps
RestQAPI.steps.given.reduce((instance, step) => instance.addGivenStep(...step), plugin)
RestQAPI.steps.when.reduce((instance, step) => instance.addWhenStep(...step), plugin)
RestQAPI.steps.then.reduce((instance, step) => instance.addThenStep(...step), plugin)

// Setup Hooks
plugin
  .addBeforeHook(RestQAPI.hooks.before)
  .addBeforeHook('@performance', RestQAPI.hooks.performance.before)
  .addAfterHook('@performance', RestQAPI.hooks.performance.after)
  .addAfterHook(RestQAPI.hooks.after)
  .addAfterAllHook(RestQAPI.hooks.afterAll)

// Add generator
plugin.Generator = RestQAPI.generator

module.exports = plugin
