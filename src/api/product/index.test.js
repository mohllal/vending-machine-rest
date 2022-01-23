import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Product } from '.'

const app = () => express(apiRoot, routes)

let admin, seller, anotherSeller, buyer, adminSession, sellerSession, anotherSellerSession, buyerSession, product, anotherProduct

beforeEach(async () => {
  admin = await User.create({ email: 'a@a.com', password: '123456', role: 'admin' })
  seller = await User.create({ email: 's@s.com', password: '123456', role: 'seller' })
  anotherSeller = await User.create({ email: 'ss@ss.com', password: '123456', role: 'seller' })
  buyer = await User.create({ email: 'b@b.com', password: '123456', role: 'buyer' })
  adminSession = signSync(admin.id)
  sellerSession = signSync(seller.id)
  anotherSellerSession = signSync(anotherSeller.id)
  buyerSession = signSync(buyer.id)
  product = await Product.create({ name: 'product', amount: 1, cost: 1, sellerId: seller })
  anotherProduct = await Product.create({ name: 'another product', amount: 1, cost: 1, sellerId: anotherSeller })
})

test('POST /products 201 (seller)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: sellerSession, name: 'test', amount: 10, cost: 10 })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.amount).toEqual(10)
  expect(body.cost).toEqual(10)
  expect(typeof body.seller).toEqual('object')
  expect(body.seller.id).toBe(seller.id)
})

test('POST /products 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, sellerId: seller.id, name: 'test', amount: 10, cost: 10 })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.amount).toEqual(10)
  expect(body.cost).toEqual(10)
  expect(typeof body.seller).toEqual('object')
  expect(body.seller.id).toBe(seller.id)
})

test('POST /products 400 (seller) - invalid amount', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: sellerSession, name: 'test', amount: -10, cost: 10 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('POST /products 400 (seller) - invalid cost', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: sellerSession, name: 'test', amount: 10, cost: -10 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('POST /products 400 (admin) - invalid amount', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, sellerId: seller.id, name: 'test', amount: -10, cost: 10 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('POST /products 400 (admin) - invalid cost', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, sellerId: seller.id, name: 'test', amount: 10, cost: -10 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('POST /products 400 (admin) - missing seller id', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, name: 'test', amount: 10, cost: -10 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('POST /products 409 - duplicated name', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: sellerSession, name: 'product', amount: 10, cost: 10 })
  expect(status).toBe(409)
  expect(typeof body).toBe('object')
})

test('POST /products 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('POST /products 401 (buyer)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: buyerSession })
  expect(status).toBe(401)
})

test('GET /products 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(body.rows.length).toBe(2)
})

test('GET /products?page=2&limit=-1 400 - invalid limit', async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ page: 2, limit: -1 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('GET /products?page=-2&limit=1 400 - invalid page', async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ page: -2, limit: 1 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('GET /products/:id 200 (seller)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${product.id}`)
    .query({ access_token: sellerSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(product.id)
  expect(typeof body.seller).toEqual('object')
  expect(body.seller.id).toBe(seller.id)
})

test('GET /products/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${product.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(product.id)
  expect(typeof body.seller).toEqual('object')
  expect(body.seller.id).toBe(seller.id)
})

test('GET /products/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${product.id}`)
  expect(status).toBe(401)
})

test('GET /products/:id 401 (buyer)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${product.id}`)
  expect(status).toBe(401)
})

test('GET /products/:id 403 (seller) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${product.id}`)
    .send({ access_token: anotherSellerSession })
  expect(status).toBe(403)
})

test('GET /products/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('PUT /products/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${product.id}`)
    .send({ access_token: adminSession, name: 'test', amount: 20, cost: 20 })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(product.id)
  expect(body.name).toEqual('test')
  expect(body.amount).toEqual(20)
  expect(body.cost).toEqual(20)
  expect(typeof body.seller).toEqual('object')
  expect(body.seller.id).toBe(seller.id)
})

test('PUT /products/:id 200 (seller)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${product.id}`)
    .send({ access_token: sellerSession, name: 'test', amount: 20, cost: 20 })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(product.id)
  expect(body.name).toEqual('test')
  expect(body.amount).toEqual(20)
  expect(body.cost).toEqual(20)
  expect(typeof body.seller).toEqual('object')
  expect(body.seller.id).toBe(seller.id)
})

test('PUT /products/:id 400 (seller) - invalid amount', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${product.id}`)
    .send({ access_token: sellerSession, amount: -10 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('PUT /products/:id 400 (seller) - invalid cost', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${product.id}`)
    .send({ access_token: sellerSession, cost: -10 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('PUT /products/:id 400 (admin) - invalid amount', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${product.id}`)
    .send({ access_token: adminSession, amount: -10 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('PUT /products/:id 400 (admin) - invalid cost', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${product.id}`)
    .send({ access_token: adminSession, cost: -10 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('PUT /products/:id 409 - duplicated name', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${anotherProduct.id}`)
    .send({ access_token: anotherSellerSession, name: 'product' })
  expect(status).toBe(409)
  expect(typeof body).toBe('object')
})

test('PUT /products/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${product.id}`)
  expect(status).toBe(401)
})

test('PUT /products/:id 401 (buyer)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${product.id}`)
    .send({ access_token: buyerSession, name: 'test', amount: 20, cost: 20 })
  expect(status).toBe(401)
})

test('PUT /products/:id 403 (seller) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${product.id}`)
    .send({ access_token: anotherSellerSession, name: 'test', amount: 20, cost: 20 })
  expect(status).toBe(403)
})

test('PUT /products/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, name: 'test', amount: 20, cost: 20 })
  expect(status).toBe(404)
})

test('DELETE /products/:id 204 (seller)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${product.id}`)
    .query({ access_token: sellerSession })
  expect(status).toBe(204)
})

test('DELETE /products/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${product.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /products/:id 403 (seller) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${product.id}`)
    .send({ access_token: anotherSellerSession })
  expect(status).toBe(403)
})

test('DELETE /products/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${product.id}`)
  expect(status).toBe(401)
})

test('DELETE /products/:id 401 (buyer)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${product.id}`)
  expect(status).toBe(401)
})

test('DELETE /products/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
