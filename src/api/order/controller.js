import { success, notFound, ownerOrAdmin } from '../../services/response/'
import { Order } from '.'

export const index = ({ query: { page = 1, limit = 30, sort = '-createdAt' } }, res, next) =>
  Order.index(page, limit, sort)
    .then(success(res))
    .catch(next)

export const show = ({ params, user }, res, next) =>
  Order.findById(params.id)
    .populate('buyerId')
    .populate('productId')
    .then(notFound(res))
    .then(ownerOrAdmin(res, user, 'buyerId'))
    .then((order) => order ? order.view(true) : null)
    .then(success(res))
    .catch(next)
