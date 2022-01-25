import { Router } from 'express'
import { token } from '../../services/passport'
import { buy as vBuy, deposit as vDeposit, reset as vReset } from './validator'
import { buy, deposit, reset } from './controller'

const router = new Router()

/**
 * @api {post} /vending/buy Buy product
 * @apiName BuyProduct
 * @apiGroup Vending
 * @apiPermission buyer
 * @apiParam {String} access_token User access token.
 * @apiParam {String} productId Product's id.
 * @apiParam {Number{1..}} amount Purchase amount.
 * @apiSuccess (Success 201) {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Buyer access only.
 * @apiError 403 Forbidden access.
 */
router.post('/buy',
  token({ required: true, roles: ['buyer'] }),
  vBuy,
  buy)

/**
 * @api {post} /vending/deposit Deposit coins
 * @apiName DepositCoins
 * @apiGroup Vending
 * @apiPermission buyer
 * @apiParam {String} access_token User access token.
 * @apiParam {Number=5,10,20,50,100} amount Deposit amount.
 * @apiSuccess {Number} coins User's total coins.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Buyer access only.
 * @apiError 403 Forbidden access.
 */
router.post('/deposit',
  token({ required: true, roles: ['buyer'] }),
  vDeposit,
  deposit)

/**
 * @api {post} /vending/reset Reset coins
 * @apiName ResetCoins
 * @apiGroup Vending
 * @apiPermission buyer
 * @apiParam {String} access_token User access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Buyer access only.
 * @apiError 403 Forbidden access.
 */
router.post('/reset',
  token({ required: true, roles: ['buyer'] }),
  vReset,
  reset)

export default router
