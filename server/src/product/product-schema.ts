const Joi = require('joi')

export const productSchema = Joi.object({
  productId: Joi.string().alphanum().min(2).max(50).required()
})
