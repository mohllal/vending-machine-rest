import { User } from '.'

let user

beforeEach(async () => {
  user = await User.create({ name: 'user', email: 'a@a.com', password: '123456', role: 'admin' })
})

describe('set email', () => {
  it('sets name automatically', () => {
    user.name = ''
    user.email = 'test@example.com'
    expect(user.name).toBe('test')
  })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = user.view()
    expect(view).toBeDefined()
    expect(view.id).toBe(user.id)
    expect(view.name).toBe(user.name)
  })

  it('returns full view', () => {
    const view = user.view(true)
    expect(view).toBeDefined()
    expect(view.id).toBe(user.id)
    expect(view.name).toBe(user.name)
    expect(view.role).toBe(user.role)
    expect(view.email).toBe(user.email)
    expect(view.createdAt).toEqual(user.createdAt)
    expect(view.updatedAt).toEqual(user.updatedAt)
  })
})

describe('authenticate', () => {
  it('returns the user when authentication succeed', async () => {
    expect(await user.authenticate('123456')).toBe(user)
  })

  it('returns false when authentication fails', async () => {
    expect(await user.authenticate('blah')).toBe(false)
  })
})
