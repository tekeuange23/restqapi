const path = require('path')
const fs = require('fs')
const YAML = require('yaml')

function Performance (config = {}) {
  if (['artillery'].includes(config.type) === false) {
    throw new Error('The performance property "type" should be specify. (available: artillery)')
  }

  const features = {}
  const add = (apis, scenario) => {
    if (apis.length === 0) return false
    if (scenario.result.status !== 'passed') return false

    const filename = path.basename(scenario.sourceLocation.uri, '.feature') + '.yml'
    features[filename] = features[filename] || []
    features[filename].push({ apis, scenario })
    return true
  }

  const print = () => {
    if (fs.existsSync(config.outputFolder) === false) {
      fs.mkdirSync(config.outputFolder, { recursive: true })
    }
    for (const name in features) {
      const content = {
        scenarios: features[name].reduce((output, item) => {
          const scenario = {
            name: item.scenario.pickle.name,
            flow: item.apis.map(api => {
              const options = api.request.getOptions()
              const obj = {
                url: options.pathname,
                headers: clean(options.headers)
              }

              if (options.searchParams) {
                obj.qs = clean(options.searchParams)
              }

              if (options.json) {
                obj.json = clean(options.json)
              }

              if (options.body) {
                obj.formData = clean(api.request.bodyBackup)
              }
              const result = {}
              result[options.method || 'get'] = obj
              return result
            })
          }
          output.push(scenario)
          return output
        }, [])
      }
      fs.writeFileSync(path.resolve(config.outputFolder, name), YAML.stringify(content))
    }
  }

  return {
    features,
    add,
    print
  }
}

function clean (obj) {
  return Object.keys(obj).reduce((result, key) => {
    if (obj[key] !== undefined) result[key] = obj[key]
    return result
  }, {})
}

module.exports = Performance
