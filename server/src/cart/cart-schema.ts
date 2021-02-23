const Joi = require('joi')

const item = Joi.object({
  id: Joi.string().required(),
  quantity: Joi.number().required()
})

export const cartSchema = Joi.object().pattern(/^/, Joi.number().required())
