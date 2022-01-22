export const success = (res, status) => (entity) => {
  if (entity) {
    res.status(status || 200).json(entity)
  }
  return null
}

export const badRequest = (res) => (error) => {
  if (error) {
    res.status(400).json({ msg: error.message })
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
    res.status(401).end()
  }
  return null
}
