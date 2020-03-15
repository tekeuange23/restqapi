
require('dotenv').config();

if (!process.env.API_ENV) {
    console.error('THE ENV VARIABLE "API_ENV" NEEDS TO BE DEFINED')
    process.exit(1)
}


let openIdConfig = {}

async function Config() {

  return {
    env: process.env.API_ENV,
    api: {
      url: process.env.API_GATEWAY_URL
    }
  }
}

module.exports = Config
