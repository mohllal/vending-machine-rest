import Joi, { validate } from '../../services/joi'

export const index = validate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    sort: Joi.string().optional(),
    access_token: Joi.string().optional()
  })
})

export const show = validate({
  query: Joi.object().keys({
    access_token: Joi.string().optional()
  })
})
