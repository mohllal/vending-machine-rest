import { Order } from '.'
import { Product } from '../product'
import { User } from '../user'

let buyer, seller, product, order

beforeEach(async () => {
  buyer = await User.create({ email: 'b@b.com', password: '123456', role: 'buyer' })
  seller = await User.create({ email: 's@s.com', password: '123456', role: 'seller' })
  product = await Product.create({ sellerId: seller, amount: 10, cost: 1, name: 'product' })
  order = await Order.create({ buyerId: buyer, productId: product, amount: 1, cost: 1 })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = order.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(order.id)
    expect(view.amount).toBe(order.amount)
    expect(view.cost).toBe(order.cost)
  })

  it('returns full view', () => {
    const view = order.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(order.id)
    expect(typeof view.buyer).toBe('object')
    expect(view.buyer.id).toBe(buyer.id)
    expect(typeof view.product).toBe('object')
    expect(view.product.id).toBe(product.id)
    expect(view.name).toBe(order.name)
    expect(view.amount).toBe(order.amount)
    expect(view.cost).toBe(order.cost)
    expect(view.createdAt).toEqual(order.createdAt)
    expect(view.updatedAt).toEqual(order.updatedAt)
  })
})
