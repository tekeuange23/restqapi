const Api = require('./api')
const { Notebook } = require('./utils')

function apis (config) {
  const list = []
  let logs

  const get = n => {
    return list[n]
  }

  const create = () => {
    let options = {
      config,
      logs,
    }
    const api = new Api(options)
    list.push(api)
    return api
  }

  return {
    notebook: new Notebook(),
    create,
    get,
    get length () {
      return list.length
    },
    set logs(value) {
      logs =  value
    },
  }
}

module.exports = apis
