import Joi, { validate } from '../../services/joi'

export const create = validate({
  body: Joi.object().keys({
    sellerId: Joi.string().optional(),
    name: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    cost: Joi.number().min(1).required(),
    access_token: Joi.string().optional()
  })
})

export const index = validate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    sort: Joi.string().optional()
  })
})

export const show = validate({
  query: Joi.object().keys({
    access_token: Joi.string().optional()
  })
})

export const update = validate({
  body: Joi.object().keys({
    name: Joi.string().optional(),
    amount: Joi.number().min(1).optional(),
    cost: Joi.number().min(1).optional(),
    access_token: Joi.string().optional()
  }).or('name', 'amount', 'cost')
})

export const destroy = validate({
  query: Joi.object().keys({
    access_token: Joi.string().optional()
  })
})
