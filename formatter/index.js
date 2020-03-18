const { JsonFormatter } = require('cucumber')
const Transport = require('./transport')

class RestQaFormatter extends JsonFormatter {


  onTestRunFinished(result) {
    let instance = this
    instance.log = new Transport(result)
    super.onTestRunFinished.call(instance)
  }

}

module.exports = RestQaFormatter
