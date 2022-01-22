import { Router } from 'express'
import { token } from '../../services/passport'
import { create as vCreate, index as vIndex, show as vShow, update as vUpdate, destroy as vDestroy } from './validator'
import { create, index, show, update, destroy } from './controller'
export Product, { schema } from './model'

const router = new Router()

/**
 * @api {post} /products Create product
 * @apiName CreateProduct
 * @apiGroup Product
 * @apiPermission admin
 * @apiPermission seller
 * @apiParam {String} access_token user access token.
 * @apiParam {Number{1..}} amount Product's amount.
 * @apiParam {Number{1..}} cost Product's cost.
 * @apiParam {String} name Product's name.
 * @apiParam {String} [sellerId] Product's seller id.
 * @apiSuccess (Success 201) {Object} product Product's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 409 Name already exists.
 * @apiError 401 Admin or seller access only.
 * @apiError 403 Forbidden access.
 */
router.post('/',
  token({ required: true, roles: ['admin', 'seller'] }),
  vCreate,
  create)

/**
 * @api {get} /products Retrieve products
 * @apiName RetrieveProducts
 * @apiGroup Product
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of products.
 * @apiSuccess {Object[]} rows List of products.
 * @apiSuccess {Number} count Total number of products.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  vIndex,
  index)

/**
 * @api {get} /products/:id Retrieve product
 * @apiName RetrieveProduct
 * @apiGroup Product
 * @apiPermission admin
 * @apiPermission seller
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} product Product's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Product not found.
 * @apiError 401 Admin or seller access only.
 * @apiError 403 Forbidden access.
 */
router.get('/:id',
  token({ required: true, roles: ['admin', 'seller'] }),
  vShow,
  show)

/**
 * @api {put} /products/:id Update product
 * @apiName UpdateProduct
 * @apiGroup Product
 * @apiPermission admin
 * @apiPermission seller
 * @apiParam {String} access_token user access token.
 * @apiParam {Number{1..}} amount Product's amount.
 * @apiParam {Number{1..}} cost Product's cost.
 * @apiParam {String} name Product's name.
 * @apiSuccess {Object} product Product's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 409 Name already exists.
 * @apiError 404 Product not found.
 * @apiError 401 Admin or seller access only.
 * @apiError 403 Forbidden access.
 */
router.put('/:id',
  token({ required: true, roles: ['admin', 'seller'] }),
  vUpdate,
  update)

/**
 * @api {delete} /products/:id Delete product
 * @apiName DeleteProduct
 * @apiGroup Product
 * @apiPermission admin
 * @apiPermission seller
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Product not found.
 * @apiError 401 Admin or seller access only.
 * @apiError 403 Forbidden access.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin', 'seller'] }),
  vDestroy,
  destroy)

export default router
