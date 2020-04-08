const Joi = require('@hapi/joi')
function validate (config) {
  const schemaEnvironment = Joi.object({
    name: Joi.string().required(),
    url: Joi.string().uri().required(),
    default: Joi.boolean().optional(),
    data: {
      channel: Joi.string(),
      config: Joi.object({}).unknown()
    },
    outputs: Joi.array().items(
      Joi.object({
        type: Joi.string(),
        enabled: Joi.boolean(),
        config: Joi.any()
      })
    )
  })

  const schemaConfig = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    environment: schemaEnvironment
  })

  console.log(config)

  const { value, error } = schemaConfig.validate(config)

  if (error) {
    throw error
  }

  return value
}

module.exports = { validate }
