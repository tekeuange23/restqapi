const when = require('./functions')

module.exports = [
  ['I run the API', when.callApi, 'Trigger the api request', 'api, call']
]

