const when = require('./functions')

module.exports = [
  /**
   *  Format:
   *  ['Step definition', function handler, 'description','Tags']
   *
   *  Example:
   *  ['I do {int} + {int}', add, 'Calculate an addition', 'add, calculator, additional']
   *
   */
  ['I run the API', when.callApi, 'Trigger the api request', 'api, call']
]
