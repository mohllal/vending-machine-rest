export const success = (res, status = 200) => (entity) => {
  if (entity) {
    res.status(status).json(entity)
  }
  return null
}

export const error = (res, status = 500) => (error) => {
  if (error) {
    res.status(status).json({ msg: error.message })
  }
  return null
}

export const notFound = (res) => (entity) => {
  if (entity) {
    return entity
  }
  res.status(404).end()
  return null
}

export const ownerOrAdmin = (res, user, userField) => (entity) => {
  if (entity) {
    const isAdmin = user.role === 'admin'
    const isOwner = entity[userField] && entity[userField].equals(user.id)
    if (isOwner || isAdmin) {
      return entity
    }
    res.status(403).end()
  }
  return null
}
