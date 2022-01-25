import { Router } from 'express'
import { token } from '../../services/passport'
import { index as vIndex, show as vShow } from './validator'
import { index, show } from './controller'
export Order, { schema } from './model'

const router = new Router()

/**
 * @api {get} /orders Retrieve orders
 * @apiName RetrieveOrders
 * @apiGroup Order
 * @apiPermission admin
 * @apiParam {String} access_token User access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of orders.
 * @apiSuccess {Object[]} rows List of orders.
 * @apiSuccess {Number} count Total number of orders.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 * @apiError 403 Forbidden access.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  vIndex,
  index)

/**
 * @api {get} /orders/:id Retrieve order
 * @apiName RetrieveOrder
 * @apiGroup Order
 * @apiPermission admin
 * @apiPermission buyer
 * @apiParam {String} access_token User access token.
 * @apiSuccess {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 * @apiError 401 Admin or buyer access only.
 * @apiError 403 Forbidden access.
 */
router.get('/:id',
  token({ required: true, roles: ['admin', 'buyer'] }),
  vShow,
  show)

export default router
