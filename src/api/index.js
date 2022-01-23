import { Router } from 'express'
import user from './user'
import auth from './auth'
import product from './product'
import order from './order'

const router = new Router()

/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine seller Seller access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine buyer Buyer access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine user Admin, Buyer, or Seller access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine listParams
 * @apiParam {Number{1..}} [page=1] Page number.
 * @apiParam {Number{1..}} [limit=30] Amount of returned items.
 * @apiParam {String} [sort=-createdAt] Order of returned items (comma-separated string).
 */
router.use('/users', user)
router.use('/auth', auth)
router.use('/products', product)
router.use('/orders', order)

export default router
