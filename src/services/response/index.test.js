import * as response from '.'

let res

beforeEach(() => {
  res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    end: jest.fn(() => res)
  }
})

describe('success', () => {
  it('responds with passed object and status 200', () => {
    expect(response.success(res)({ prop: 'value' })).toBeNull()
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({ prop: 'value' })
  })

  it('responds with passed object and status 201', () => {
    expect(response.success(res, 201)({ prop: 'value' })).toBeNull()
    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith({ prop: 'value' })
  })

  it('does not send any response when object has not been passed', () => {
    expect(response.success(res, 201)()).toBeNull()
    expect(res.status).not.toBeCalled()
  })
})

describe('error', () => {
  it('responds with passed object and status 500', () => {
    expect(response.error(res)(new Error('value'))).toBeNull()
    expect(res.status).toBeCalledWith(500)
    expect(res.json).toBeCalledWith({ msg: 'value' })
  })

  it('responds with passed object and status 400', () => {
    expect(response.error(res, 400)(new Error('value'))).toBeNull()
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith({ msg: 'value' })
  })

  it('does not send any response when object has not been passed', () => {
    expect(response.success(res, 400)()).toBeNull()
    expect(res.status).not.toBeCalled()
  })
})

describe('notFound', () => {
  it('responds with status 404 when object has not been passed', () => {
    expect(response.notFound(res)()).toBeNull()
    expect(res.status).toBeCalledWith(404)
    expect(res.end).toHaveBeenCalledTimes(1)
  })

  it('returns the passed object and does not send any response', () => {
    expect(response.notFound(res)({ prop: 'value' })).toEqual({ prop: 'value' })
    expect(res.status).not.toBeCalled()
    expect(res.end).not.toBeCalled()
  })
})

describe('ownerOrAdmin', () => {
  let user, entity

  beforeEach(() => {
    user = {
      id: 1,
      role: 'user'
    }
    entity = {
      owner: {
        id: 1,
        equals (id) {
          return id === this.id
        }
      }
    }
  })

  it('returns the passed entity when owner is the same', () => {
    expect(response.ownerOrAdmin(res, user, 'owner')(entity)).toEqual(entity)
  })

  it('returns the passed entity when owner is admin', () => {
    user.role = 'admin'
    expect(response.ownerOrAdmin(res, user, 'user')(entity)).toEqual(entity)
  })

  it('responds with status 403 when owner is not the same or admin', () => {
    user.id = 2
    expect(response.ownerOrAdmin(res, user, 'owner')(entity)).toBeNull()
    expect(res.status).toBeCalledWith(403)
    expect(res.end).toHaveBeenCalledTimes(1)
  })

  it('returns null without sending response when entity has not been passed', () => {
    expect(response.ownerOrAdmin(res, user, 'owner')()).toBeNull()
  })
})
