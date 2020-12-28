const { URL } = require('url')
const API = require('./api')
const Steps = require('../steps')

module.exports = async function(options) {  
  if (!options) throw new ReferenceError('Please provide an object containing your request')
  if (!options.url) throw new ReferenceError('Please specify your url')
  if (options.method && !['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE', 'HEAD'].includes(options.method)) throw new TypeError(`The method "${options.method}" is not valid, please use : GET, POST, PUT, PATCH, DELETE, OPTIONS or HEAD`)

  options.URL = new URL(options.url)
  options.method = options.method || 'GET'

  const config = {
    url: options.url
  }


  let api = new API({ config })
  api.request.setMethod(options.method)
  
  await api.run()

  let mapping = {
    request: {
      host: '',
      path: '',
      method: '',
      headers: [],
      query: [],
      body: []
    },
    action: '',
    response: {
      statusCode: 0,
      headers: [],
      body: []
    }
  }
  const Given = (definition, fn, description, tags) => {
    tags = tags.split(',').map(_ => _.trim())
    if (!tags.includes('generator')) return

    if (tags.includes('host')) {
      mapping.request.host = definition.replace('{string}', `"${options.URL.origin}"`)
    }

    if (tags.includes('path')) {
      mapping.request.path = definition.replace('{string}', `"${options.URL.pathname}"`)
    }

    if (tags.includes('method')) {
      mapping.request.method = definition.replace('{string}', `"${options.method}"`)
    }
  }

  const When  = (definition, fn, description, tags) => {
    if (!tags.includes('generator')) return

    if (tags.includes('call')) {
      mapping.action = definition
    }
  }


  const bodiesDefinitions = []
  const Then = (definition, fn, description, tags) => {
    if (!tags.includes('generator')) return
    if (tags.includes('status')) {
      mapping.response.statusCode = definition.replace('{int}', api.response.statusCode)
      return
    }

    if (tags.includes('body')) {
      bodiesDefinitions.push({ tags, definition })
    }
  }
  

  Steps({Given, When, Then})

  Object.keys(api.response.dotBody).forEach((key, i, properties) => {
    let value = api.response.dotBody[key]
    let definition = ''

    if (/.\d./.test(key) && false === /.\d./.test(properties[i-1])) {
      let match = key.match(/((.*).)?(\d.)(.*)/)

      
      if (match[1]) {
        let items = api.response.findInBody('$.' + match[2])

        definition = bodiesDefinitions.find(obj => obj.tags.includes('array')).definition.replace('{string}', `"${match[2]}"`)
        mapping.response.body.push(definition)

        definition = bodiesDefinitions.find(obj => obj.tags.includes('array-items')).definition
          .replace('{string}', `"${match[2]}"`)
          .replace('{int}', `${items.length}`)
        mapping.response.body.push(definition)
      }
    }

    if (/^\d./.test(key) && 0 === i) {
      let match = key.match(/^(\d.)/)
      let items = properties
        .reduce((all, ikey) => {
          let _match = ikey.match(/^(\d.)/)
          if (_match ) all[_match[0]] = true
          return all
        }, {})

      definition = bodiesDefinitions.find(obj => obj.tags.includes('array-body')).definition.replace('{int}', `${Object.keys(items).length}`)
      mapping.response.body.push(definition)
    }

    if (typeof value === 'string') {
      definition = bodiesDefinitions.find(obj => obj.tags.includes('string')).definition
            .replace('{string}', `"${key}"`)
            .replace('{string}', `"${value}"`)
    }

    if (typeof value === 'number') {
      definition = bodiesDefinitions.find(obj => obj.tags.includes('number')).definition
            .replace('{string}', `"${key}"`)
            .replace('{int}', `${value}`)
    }

    if (typeof value === 'boolean' && true === value) {
      definition = bodiesDefinitions.find(obj => obj.tags.includes('true')).definition.replace('{string}', `"${key}"`)
    }

    if (typeof value === 'boolean' && false === value) {
      definition = bodiesDefinitions.find(obj => obj.tags.includes('false')).definition.replace('{string}', `"${key}"`)
    }

    if (value === null) {
      definition = bodiesDefinitions.find(obj => obj.tags.includes('null')).definition.replace('{string}', `"${key}"`)
    }

    mapping.response.body.push(definition)
  })

  const result = []
  result.push(`Given ${mapping.request.host}`)
  result.push(`  And ${mapping.request.path}`)
  result.push(`  And ${mapping.request.method}`)
  result.push(`When ${mapping.action}`)
  result.push(`Then ${mapping.response.statusCode}`)
  mapping.response.body.forEach(definition => {
    result.push(`  And ${definition}`)
  })

  return result.join('\n')
}

