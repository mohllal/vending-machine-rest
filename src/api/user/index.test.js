import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import routes, { User } from '.'

const app = () => express(apiRoot, routes)

let buyer, seller, admin, buyerSession, sellerSession, adminSession

const passwordMatch = async (password, userId) => {
  const user = await User.findById(userId)
  return !!await user.authenticate(password)
}

beforeEach(async () => {
  buyer = await User.create({ name: 'buyer', email: 'b@b.com', password: '123456', role: 'buyer' })
  seller = await User.create({ name: 'seller', email: 's@s.com', password: '123456', role: 'seller' })
  admin = await User.create({ name: 'admin', email: 'c@c.com', password: '123456', role: 'admin' })
  buyerSession = signSync(buyer.id)
  sellerSession = signSync(seller.id)
  adminSession = signSync(admin.id)
})

test('GET /users 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /users?page=2&limit=1 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ access_token: adminSession, page: 2, limit: 1 })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(body.rows.length).toBe(1)
})

test('GET /users?page=2&limit=-1 400 (admin) - invalid limit', async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ access_token: adminSession, page: 2, limit: -1 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('GET /users?page=-2&limit=1 400 (admin) - invalid page', async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ access_token: adminSession, page: -2, limit: 1 })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('GET /users 403 (buyer)', async () => {
  const { status } = await request(app())
    .get(apiRoot)
    .query({ access_token: buyerSession })
  expect(status).toBe(403)
})

test('GET /users 403 (seller)', async () => {
  const { status } = await request(app())
    .get(apiRoot)
    .query({ access_token: sellerSession })
  expect(status).toBe(403)
})

test('GET /users 401', async () => {
  const { status } = await request(app())
    .get(apiRoot)
  expect(status).toBe(401)
})

test('GET /users/me 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(apiRoot + '/me')
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.id).toBe(admin.id)
})

test('GET /users/me 200 (buyer)', async () => {
  const { status, body } = await request(app())
    .get(apiRoot + '/me')
    .query({ access_token: buyerSession })
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.id).toBe(buyer.id)
})

test('GET /users/me 200 (seller)', async () => {
  const { status, body } = await request(app())
    .get(apiRoot + '/me')
    .query({ access_token: sellerSession })
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.id).toBe(seller.id)
})

test('GET /users/me 401', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/me')
  expect(status).toBe(401)
})

test('GET /users/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${seller.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.id).toBe(seller.id)
  expect(body.email).toBe(seller.email)
  expect(body.role).toBe(seller.role)
  expect(body.name).toBe(seller.name)
})

test('GET /users/:id 403 (seller)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${seller.id}`)
    .query({ access_token: sellerSession })
  expect(status).toBe(403)
})

test('GET /users/:id 403 (buyer)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${buyer.id}`)
    .query({ access_token: buyerSession })
  expect(status).toBe(403)
})

test('GET /users/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('POST /users 201', async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ email: 'd@d.com', password: '123456', role: 'admin' })
  expect(status).toBe(201)
  expect(typeof body).toBe('object')
  expect(typeof body.user).toBe('object')
  expect(typeof body.token).toBe('string')
  expect(body.user.email).toBe('d@d.com')
})

test('POST /users 409 - duplicated email', async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ email: 'b@b.com', password: '123456', role: 'admin' })
  expect(status).toBe(409)
  expect(typeof body).toBe('object')
})

test('POST /users 400 - invalid email', async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ email: 'invalid', password: '123456', role: 'admin' })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('POST /users 400 - missing email', async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ password: '123456', role: 'admin' })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('POST /users 400 - invalid password', async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ email: 'd@d.com', password: '123', role: 'admin' })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('POST /users 400 - missing password', async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ email: 'd@d.com', role: 'admin' })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('POST /users 400 - invalid role', async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ email: 'd@d.com', password: '123456', role: 'invalid' })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('POST /users 400 - missing role', async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ email: 'd@d.com', password: '123456' })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('PUT /users/:id 200 (buyer) - update name', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${buyer.id}`)
    .send({ access_token: buyerSession, name: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.name).toBe('test')
})

test('PUT /users/:id 200 (seller) - update name ', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${seller.id}`)
    .send({ access_token: sellerSession, name: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.name).toBe('test')
})

test('PUT /users/:id 200 (admin) - update name', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${buyer.id}`)
    .send({ access_token: adminSession, name: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.name).toBe('test')
})

test('PUT /users/:id 200 (buyer) - update password', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${buyer.id}`)
    .send({ access_token: buyerSession, password: '654321' })

  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.email).toBe('b@b.com')
  expect(await passwordMatch('654321', body.id)).toBe(true)
})

test('PUT /users/:id 400 (buyer) - invalid password', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${buyer.id}`)
    .send({ access_token: buyerSession, password: '123' })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('PUT /users/:id 200 (seller) - update password', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${seller.id}`)
    .send({ access_token: sellerSession, password: '654321' })

  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.email).toBe('s@s.com')
  expect(await passwordMatch('654321', body.id)).toBe(true)
})

test('PUT /users/:id 400 (seller) - invalid password', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${seller.id}`)
    .send({ access_token: sellerSession, password: '123' })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('PUT /users/:id 200 (admin) - update password', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${seller.id}`)
    .send({ access_token: adminSession, password: '654321' })

  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.email).toBe('s@s.com')
  expect(await passwordMatch('654321', body.id)).toBe(true)
})

test('PUT /users/:id 400 (admin) - invalid password', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${seller.id}`)
    .send({ access_token: adminSession, password: '123' })
  expect(status).toBe(400)
  expect(typeof body).toBe('object')
})

test('PUT /users/:id 403 (seller) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${buyer.id}`)
    .send({ access_token: sellerSession, name: 'test' })
  expect(status).toBe(403)
})

test('PUT /users/:id 403 (buyer) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${seller.id}`)
    .send({ access_token: buyerSession, name: 'test' })
  expect(status).toBe(403)
})

test('PUT /users/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${buyer.id}`)
    .send({ name: 'test' })
  expect(status).toBe(401)
})

test('PUT /users/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, name: 'test' })
  expect(status).toBe(404)
})

test('DELETE /users/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${buyer.id}`)
    .send({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /users/:id 403 (buyer)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${buyer.id}`)
    .send({ access_token: buyerSession })
  expect(status).toBe(403)
})

test('DELETE /users/:id 403 (seller)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${seller.id}`)
    .send({ access_token: sellerSession })
  expect(status).toBe(403)
})

test('DELETE /users/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${buyer.id}`)
  expect(status).toBe(401)
})

test('DELETE /users/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession })
  expect(status).toBe(404)
})
