const winston = require('winston');
const uuidv4 = require('uuid/v4');

const prettyJson = winston.format.printf(info => {
  if (info.message.constructor === Object) {
    info.message = JSON.stringify(info.message, null, 4)
  }
  return `${info.level}: ${info.message}`
})

module.exports = function(serverMode) {
  serverMode = serverMode || false

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.simple(),
      prettyJson,
    ),
    transports: [
      new winston.transports.Console({format: winston.format.simple()})
    ]
  })

  let id = 'e2e-test-' + uuidv4()
  logger.getId = () => id

  if (serverMode) {
    let options = {
      filename: `/tmp/${logger.getId()}.log`
    }
    logger.add(new winston.transports.File(options))
  }

  return logger
}
