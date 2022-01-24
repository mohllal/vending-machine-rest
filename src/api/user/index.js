import { Router } from 'express'
import { token } from '../../services/passport'
import { create as vCreate, index as vIndex, showMe as vShowMe, show as vShow, update as vUpdate, destroy as vDestroy } from './validator'
import { index, showMe, show, create, update, destroy } from './controller'
export User, { schema } from './model'

const router = new Router()

/**
 * @api {post} /users Create user
 * @apiName CreateUser
 * @apiGroup User
 * @apiParam {String} email User's email.
 * @apiParam {String{6..}} password User's password.
 * @apiParam {String=admin,buyer,seller} role User's role.
 * @apiParam {String} [name] User's name.
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 409 Email already registered.
 */
router.post('/',
  vCreate,
  create)

/**
 * @api {get} /users Retrieve users
 * @apiName RetrieveUsers
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiUse listParams
 * @apiSuccess {Object[]} rows List of users.
 * @apiSuccess {Number} count Total number of users.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 * @apiError 403 Forbidden access.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  vIndex,
  index)

/**
 * @api {get} /users/me Retrieve current user
 * @apiName RetrieveCurrentUser
 * @apiGroup User
 * @apiPermission user
 * @apiParam {String} access_token User access_token.
 * @apiSuccess {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current user access only.
 * @apiError 403 Forbidden access.
 */
router.get('/me',
  token({ required: true }),
  vShowMe,
  showMe)

/**
 * @api {get} /users/:id Retrieve user
 * @apiName RetrieveUser
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiSuccess {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 User not found.
 * @apiError 401 Admin access only.
 * @apiError 403 Forbidden access.
 */
router.get('/:id',
  token({ required: true, roles: ['admin'] }),
  vShow,
  show)

/**
 * @api {put} /users/:id Update user
 * @apiName UpdateUser
 * @apiGroup User
 * @apiPermission user
 * @apiParam {String} access_token User access_token.
 * @apiParam {String} name User's name.
 * @apiParam {String} password User's password.
 * @apiSuccess {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 User not found.
 * @apiError 401 Current user or admin access only.
 * @apiError 403 Forbidden access.
 */
router.put('/:id',
  token({ required: true }),
  vUpdate,
  update)

/**
 * @api {delete} /users/:id Delete user
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 User not found.
 * @apiError 401 Admin access only.
 * @apiError 403 Forbidden access.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  vDestroy,
  destroy)

export default router
