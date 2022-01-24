import Joi, { validate } from '../../services/joi'

export const buy = validate({
  body: Joi.object().keys({
    productId: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    access_token: Joi.string().optional()
  })
})

export const deposit = validate({
  body: Joi.object().keys({
    amount: Joi.number().valid(5, 10, 20, 50, 100).required(),
    access_token: Joi.string().optional()
  })
})

export const reset = validate({
  body: Joi.object().keys({
    access_token: Joi.string().optional()
  })
})
