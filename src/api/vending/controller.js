import mongoose from 'mongoose'
import { success, notFound, error } from '../../services/response/'
import { Order } from '../order'
import { User } from '../user'
import { Product } from '../product'

export const buy = async ({ user, body: { productId, amount } }, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const product = await Product.findOneAndUpdate({ _id: productId, amount: { $gte: amount } }, { $inc: { amount: -1 * amount } }, { session })
    if (!product) throw new Error('insufficient stock or product not found')

    const cost = product.cost * amount

    const buyer = await User.findOneAndUpdate({ _id: user.id, deposit: { $gte: cost } }, { $inc: { deposit: -1 * cost } }, { session })
    if (!buyer) throw new Error('insufficient deposit or buyer not found')

    const order = new Order({ buyerId: buyer, productId: product, amount, cost })
    await order.save({ session })

    await session.commitTransaction()
    session.endSession()
    return success(res, 201)(order.view(false))
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    return error(res, 400)(err)
  }
}

export const deposit = ({ user, body: { amount } }, res, next) =>
  User.findById(user.id)
    .then(notFound(res))
    .then((user) => user ? Object.assign(user, { deposit: user.deposit + amount }).save() : null)
    .then((user) => user ? { coins: user.deposit } : null)
    .then(success(res))
    .catch(next)

export const reset = ({ user }, res, next) =>
  User.findById(user.id)
    .then(notFound(res))
    .then((user) => user ? Object.assign(user, { deposit: 0 }).save() : null)
    .then(success(res, 204))
    .catch(next)
