const fs = require('fs')
const path = require('path')
const YAML = require('yaml')

function error(msg) {
  console.error(`-----`)
  console.error(msg)
  console.error(`-----`)
  process.exit(1)
}

module.exports = function(configFile) {
  const ENV_PROPERTY = 'API_ENV'
  
  if (!fs.existsSync(configFile)) {
    error(`THE RESQA CONFIG FILE IS MISSING (${configFile})`)
  }
  
  const file = fs.readFileSync(configFile, 'utf8')
  
  const config = YAML.parse(file)
  const envs = config.environments.map(env => env.name)
  
  config.env = String(process.env.API_ENV).toLowerCase()
  
  if (!config.env || !envs.includes(config.env)) {
    error(`THE ENV VARIABLE "${ENV_PROPERTY}" NEEDS TO BE DEFINED (${envs.join(' | ')})`)
  }
  
  config.api = config.environments.find(env => config.env === env.name.toLowerCase())

  return config
}
