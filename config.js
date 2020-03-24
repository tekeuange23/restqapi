const fs = require('fs')
const path = require('path')
const YAML = require('yaml')

function error(msg) {
  console.error(`-----`)
  console.error(msg)
  console.error(`-----`)
  process.exit(1)
}

module.exports = function({env, configFile}) {
  
  if (!fs.existsSync(configFile)) {
    error(`THE RESQA CONFIG FILE IS MISSING (${configFile})`)
  }
  
  const file = fs.readFileSync(configFile, 'utf8')
  const config = YAML.parse(file)
  const envs = config.environments.map(env => env.name)

  if (!env) {
    env = (config.environments.find(e => e.default) || {}).name
  }
  
  if (!env || !envs.includes(env)) {
    error(`THE ENVIRONMENT NEEDS TO BE DEFINED AS (${envs.join(' | ')})`)
  }
  
  config.api = config.environments.find(e => env === e.name.toLowerCase())

  return config
}
