import { success, notFound, ownerOrAdmin, error } from '../../services/response/'
import { User } from '.'
import { sign } from '../../services/jwt'

export const index = ({ query: { page = 1, limit = 30, sort = '-createdAt' } }, res, next) =>
  User.index(page, limit, sort)
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const showMe = ({ user }, res) =>
  res.json(user.view(true))

export const create = ({ body }, res, next) =>
  User.create(body)
    .then(user => {
      sign(user.id)
        .then((token) => ({ token, user: user.view(true) }))
        .then(success(res, 201))
    })
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) error(res, 409)(new Error('email already existed'))
      else next(err)
    })

export const update = ({ body, params, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then(ownerOrAdmin(res, user, '_id'))
    .then((user) => user ? Object.assign(user, body).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)
