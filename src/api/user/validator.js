import Joi, { validate } from '../../services/joi'
import User from './model'

export const create = validate({
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(...User.roles).required(),
    name: Joi.string().optional()
  })
})

export const index = validate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    sort: Joi.string().optional(),
    access_token: Joi.string().optional()
  })
})

export const showMe = validate({
  query: Joi.object().keys({
    access_token: Joi.string().optional()
  })
})

export const show = validate({
  query: Joi.object().keys({
    access_token: Joi.string().optional()
  })
})

export const update = validate({
  body: Joi.object().keys({
    password: Joi.string().min(6).optional(),
    name: Joi.string().optional(),
    access_token: Joi.string().optional()
  }).or('password', 'name')
})

export const destroy = validate({
  query: Joi.object().keys({
    access_token: Joi.string().optional()
  })
})
