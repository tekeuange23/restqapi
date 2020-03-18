const fs = require('fs')
const YAML = require('yaml')

require('dotenv').config();

const ENV_PROPERTY = 'API_ENV'

const url = __dirname + '/.restqa.yml'
const file = fs.readFileSync(url, 'utf8')

const config = YAML.parse(file)
const envs = config.environments.map(env => env.name)

config.env = process.env.API_ENV.toLowerCase()

if (!config.env || !envs.includes(config.env)) {
  console.error(`-----`)
  console.error(`THE ENV VARIABLE "${ENV_PROPERTY}" NEEDS TO BE DEFINED (${envs.join(' | ')})`)
  console.error(`-----`)
  process.exit(1)
}

config.api = config.environments.find(env => config.env === env.name.toLowerCase())


module.exports = config
