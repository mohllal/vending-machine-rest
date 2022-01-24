import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import { Product } from '../product'
import routes from '.'

const app = () => express(apiRoot, routes)

let buyer, seller, admin, product, buyerSession, sellerSession, adminSession

beforeEach(async () => {
  buyer = await User.create({ email: 'b@b.com', password: '123456', role: 'buyer', deposit: 10 })
  admin = await User.create({ email: 'a@a.com', password: '123456', role: 'admin' })
  seller = await User.create({ email: 's@s.com', password: '123456', role: 'seller' })
  product = await Product.create({ name: 'product', cost: 5, amount: 20, sellerId: seller })
  adminSession = signSync(admin.id)
  sellerSession = signSync(seller.id)
  buyerSession = signSync(buyer.id)
})

test('POST /vending/buy 201 (buyer)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}/buy`)
    .send({ access_token: buyerSession, productId: product.id, amount: 2 })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.amount).toEqual(2)
  expect(body.cost).toEqual(10)
})

test('POST /vending/buy 400 (buyer) - invalid amount', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}/buy`)
    .send({ access_token: buyerSession, productId: product.id, amount: -1 })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
})

test('POST /vending/buy 400 (buyer) - invalid product id', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}/buy`)
    .send({ access_token: buyerSession, productId: '123456789098765432123456', amount: -1 })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
})

test('POST /vending/buy 400 (buyer) - insufficient stock', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}/buy`)
    .send({ access_token: buyerSession, productId: product.id, amount: 100 })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
})

test('POST /vending/buy 400 (buyer) - insufficient deposit', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}/buy`)
    .send({ access_token: buyerSession, productId: product.id, amount: 11 })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
})

test('POST /vending/buy 400 (buyer) - missing amount', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}/buy`)
    .send({ access_token: buyerSession, productId: product.id })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
})

test('POST /vending/buy 400 (buyer) - missing product id', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}/buy`)
    .send({ access_token: buyerSession, amount: -1 })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
})

test('POST /vending/buy 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/buy`)
  expect(status).toBe(401)
})

test('POST /vending/buy 403 (admin)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/buy`)
    .send({ access_token: adminSession })
  expect(status).toBe(403)
})

test('POST /vending/buy 403 (seller)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/buy`)
    .send({ access_token: sellerSession })
  expect(status).toBe(403)
})

test('POST /vending/deposit 200 (buyer)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}/deposit`)
    .send({ access_token: buyerSession, amount: 5 })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.coins).toEqual(15)
})

test('POST /vending/deposit 400 (buyer) - invalid amount', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}/deposit`)
    .send({ access_token: buyerSession, amount: 52 })
  expect(status).toBe(400)
  expect(typeof body).toEqual('object')
})

test('POST /vending/deposit 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/deposit`)
  expect(status).toBe(401)
})

test('POST /vending/deposit 403 (seller)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/deposit`)
    .send({ access_token: sellerSession })
  expect(status).toBe(403)
})

test('POST /vending/deposit 403 (admin)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/deposit`)
    .send({ access_token: adminSession })
  expect(status).toBe(403)
})

test('POST /vending/reset (buyer)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/reset`)
    .send({ access_token: buyerSession })
  expect(status).toBe(204)
})

test('POST /vending/reset 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/reset`)
  expect(status).toBe(401)
})

test('POST /vending/reset 403 (seller)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/reset`)
    .send({ access_token: sellerSession })
  expect(status).toBe(403)
})

test('POST /vending/reset 403 (admin)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/reset`)
    .send({ access_token: adminSession })
  expect(status).toBe(403)
})
