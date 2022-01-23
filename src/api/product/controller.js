import { success, notFound, ownerOrAdmin, error } from '../../services/response/'
import { Product } from '.'
import { User } from '../user'

const seller = ({ user, sellerId }) =>
  user.role === 'seller'
    ? Promise.resolve(user)
    : sellerId
      ? User.findById(sellerId)
        .then(user => user ? Promise.resolve(user) : Promise.reject(new Error('seller not found')))
      : Promise.reject(new Error('seller not provided'))

export const create = ({ user, body }, res, next) =>
  seller({ user, sellerId: body.sellerId })
    .then(seller =>
      Product.create({ ...body, sellerId: seller })
        .then((product) => product.view(true))
        .then(success(res, 201))
        .catch((err) => {
          /* istanbul ignore else */
          if (err.name === 'MongoError' && err.code === 11000) error(res, 409)(new Error('name already existed'))
          else next(err)
        })
    )
    .catch(error(res, 400))

export const index = ({ query: { page = 1, limit = 30, sort = '-createdAt' } }, res, next) =>
  Product.index(page, limit, sort)
    .then(success(res))
    .catch(next)

export const show = ({ params, user }, res, next) =>
  Product.findById(params.id)
    .populate('sellerId')
    .then(notFound(res))
    .then(ownerOrAdmin(res, user, 'sellerId'))
    .then((product) => product ? product.view(true) : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, body, params }, res, next) =>
  Product.findById(params.id)
    .populate('sellerId')
    .then(notFound(res))
    .then(ownerOrAdmin(res, user, 'sellerId'))
    .then((product) => product ? Object.assign(product, body).save() : null)
    .then((product) => product ? product.view(true) : null)
    .then(success(res))
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) error(res, 409)(new Error('name already existed'))
      else next(err)
    })

export const destroy = ({ user, params }, res, next) =>
  Product.findById(params.id)
    .then(notFound(res))
    .then(ownerOrAdmin(res, user, 'sellerId'))
    .then((product) => product ? product.remove() : null)
    .then(success(res, 204))
    .catch(next)
