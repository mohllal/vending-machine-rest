import { Product } from '.'
import { User } from '../user'

let seller, product

beforeEach(async () => {
  seller = await User.create({ email: 'a@a.com', password: '123456', role: 'seller' })
  product = await Product.create({ sellerId: seller, amount: 10, cost: 1, name: 'product' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = product.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(product.id)
    expect(view.name).toBe(product.name)
    expect(view.amount).toBe(product.amount)
    expect(view.cost).toBe(product.cost)
  })

  it('returns full view', () => {
    const view = product.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(product.id)
    expect(typeof view.seller).toBe('object')
    expect(view.seller.id).toBe(seller.id)
    expect(view.name).toBe(product.name)
    expect(view.amount).toBe(product.amount)
    expect(view.cost).toBe(product.cost)
    expect(view.createdAt).toEqual(product.createdAt)
    expect(view.updatedAt).toEqual(product.updatedAt)
  })
})
