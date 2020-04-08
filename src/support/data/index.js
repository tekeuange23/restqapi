// const got = require('got')
const RestQData = require('@restqa/restqdata')

function Data (options) {
  options = Object.assign({
    startSymbol: '{{',
    endSymbol: '}}'
  }, options)

  const regex = /\{\{(.*)\}\}/
  const data = {}

  function parse (scenario) {
    if (!options.channel) return
    let list = JSON.stringify(scenario, null, 2).match(new RegExp(regex, 'g'))
      .map(_ => _.replace(options.startSymbol, '').replace(options.endSymbol, '').trim()) // return an array like ['1:user:lastname']
      .map(_ => _.replace(/:[^:]*$/, '')) // return an array like ['1:users']

    list = [...new Set(list)] // dedup array
    list = list.map(value => retrieve(value)) // retrieve data promises

    return Promise.all(list)
  }

  async function retrieve (value) {
    const { resource, row } = getKey(value)
    /*
    if (options.type == 'url') {
        let url =`${options.url}/data/${resource}/${row}`
        let response = await got(url, {responseType: 'json'})
        return setData(resource, row, response.body)
    }
    */
    const data = RestQData(options)
    const response = await data.get(resource, row)
    return setData(resource, row, response)
  }

  function setData (resource, rowIndex, obj) {
    data[resource] = data[resource] || {}
    data[resource][rowIndex] = obj
    // console.log(data)
  }

  function getKey (value) {
    const [row, resource, field] = value.trim().split(':')
    return {
      row,
      resource,
      field
    }
  }

  function get (value) {
    const m = value.match(regex)
    if (!m) return value
    const { resource, row, field } = getKey(m[1])
    data[resource] = data[resource] || {}
    return (data[resource][row] || {})[field]
  }

  return {
    parse,
    get
  }
}

module.exports = Data
