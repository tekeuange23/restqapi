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
  options.URL.searchParams.forEach((value, key) => {
    api.request.setQueryString(key, value)
  })

  if (options.body) {
    api.request.setPayload(options.body)
  }
  
  await api.run()

  let mapping = {
    request: {
      host: '',
      path: '',
      method: '',
      headers: [],
      query: [],
      body: null
    },
    action: '',
    response: {
      statusCode: 0,
      headers: [],
      body: null
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
    
    if (tags.includes('qs')) {
      options.URL.searchParams.forEach((value, key) => {
        definition = definition
          .replace('{string}', `"${key}"`)
          .replace('{string}', `"${value}"`)
        mapping.request.query.push(definition)
      })
    }

    if (tags.includes('headers') && options.headers) {
      Object.keys(options.headers).forEach(key => {
        let _definition = definition
          .replace('{string}', `"${key}"`)
          .replace('{string}', `"${options.headers[key]}"`)
        mapping.request.headers.push(_definition)
      })
    }

    if (tags.includes('jsonbody') && options.body) {
      definition = `
${definition}
  """
${JSON.stringify(options.body, null, 2)}
  """
`
      mapping.request.body = definition.trim()
    }

  }

  const When  = (definition, fn, description, tags) => {
    if (!tags.includes('generator')) return

    if (tags.includes('call')) {
      mapping.action = definition
    }
  }


  const Then = (definition, fn, description, tags) => {
    if (!tags.includes('generator')) return
    if (tags.includes('status')) {
      mapping.response.statusCode = definition.replace('{int}', api.response.statusCode)
    }

    if (tags.includes('jsonbody') && api.response.body) {
      definition = `
${definition}
  """
${JSON.stringify(api.response.body, null, 2)}
  """
`
      mapping.response.body = definition.trim()
    }
  }
  

  Steps({Given, When, Then})

  const result = []
  result.push(`Given ${mapping.request.host}`)
  result.push(`  And ${mapping.request.path}`)
  result.push(`  And ${mapping.request.method}`)
  mapping.request.headers.forEach(step => {
    result.push(`  And ${step}`)
  })
  mapping.request.query.forEach(step => {
    result.push(`  And ${step}`)
  })
  if (mapping.request.body) {
    result.push(`  And ${mapping.request.body}`)
  }
  result.push(`When ${mapping.action}`)
  result.push(`Then ${mapping.response.statusCode}`)
  if (mapping.response.body) {
    result.push(`  And ${mapping.response.body}`)
  }

  return result.join('\n')
}

