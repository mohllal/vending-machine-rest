import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import { Product } from '../product'
import routes, { Order } from '.'

const app = () => express(apiRoot, routes)

let admin, seller, buyer, anotherBuyer, adminSession, sellerSession, buyerSession, anotherBuyerSession, product, order

beforeEach(async () => {
  admin = await User.create({ email: 'a@a.com', password: '123456', role: 'admin' })
  seller = await User.create({ email: 's@s.com', password: '123456', role: 'seller' })
  buyer = await User.create({ email: 'b@b.com', password: '123456', role: 'buyer' })
  anotherBuyer = await User.create({ email: 'bb@bb.com', password: '123456', role: 'buyer' })
  adminSession = signSync(admin.id)
  sellerSession = signSync(seller.id)
  buyerSession = signSync(buyer.id)
  anotherBuyerSession = signSync(anotherBuyer.id)
  product = await Product.create({ name: 'product', amount: 10, cost: 10, sellerId: seller })
  order = await Order.create({ productId: product, buyerId: buyer, amount: 1, cost: 10 })
})

test('GET /orders 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(body.rows.length).toBe(1)
})

test('GET /orders?page=2&limit=-1 400 (admin) - invalid limit', async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ access_token: adminSession, page: 2, limit: -1 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('GET /orders?page=-2&limit=1 400 (admin) - invalid page', async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ access_token: adminSession, page: -2, limit: 1 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('GET /orders 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /orders 401 (buyer)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: buyerSession })
  expect(status).toBe(401)
})

test('GET /orders 401 (seller)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: sellerSession })
  expect(status).toBe(401)
})

test('GET /orders/:id 200 (buyer)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${order.id}`)
    .query({ access_token: buyerSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(order.id)
  expect(typeof body.buyer).toEqual('object')
  expect(body.buyer.id).toBe(buyer.id)
  expect(typeof body.product).toEqual('object')
  expect(body.product.id).toBe(product.id)
})

test('GET /orders/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${order.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(order.id)
  expect(typeof body.buyer).toEqual('object')
  expect(body.buyer.id).toBe(buyer.id)
  expect(typeof body.product).toEqual('object')
  expect(body.product.id).toBe(product.id)
})

test('GET /orders/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${order.id}`)
  expect(status).toBe(401)
})

test('GET /orders/:id 401 (seller)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${order.id}`)
    .query({ access_token: sellerSession })
  expect(status).toBe(401)
})

test('GET /orders/:id 403 (buyer) - another user', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${order.id}`)
    .send({ access_token: anotherBuyerSession })
  expect(status).toBe(403)
})

test('GET /orders/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
