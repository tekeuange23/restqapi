const proxyquire = require('proxyquire')
const commander = require('commander')

function getSteps (keyword) {
  const result = {}

  const register = (cucumberFn, gerkin, comment) => {
    result[cucumberFn] = result[cucumberFn] || []
    result[cucumberFn].push({ gerkin, comment })
  }

  const cucumber = {
    Given: (gerkin, fn, comment) => register('Given', gerkin, comment),
    When: (gerkin, fn, comment) => register('When', gerkin, comment),
    Then: (gerkin, fn, comment) => register('Then', gerkin, comment)
  }

  proxyquire('../step_definitions/api', {
    cucumber,
    helpers: { given: {}, when: {}, then: {} }
  })
  return result[keyword]
}

module.exports = function (cmdName) {
  console.log(1111)
  const cmd = new commander.Command(cmdName)
  cmd
    .command('e')
    .action(() => {
      const result = getSteps('Given')
      console.log(result)
    })
  return cmd
}
