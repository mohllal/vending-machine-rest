import mongoose, { Schema } from 'mongoose'
import { sortQ } from '../../utils'

const orderSchema = new Schema({
  buyerId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  cost: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
})

orderSchema.methods = {
  view (full) {
    const view = {
      id: this.id,
      amount: this.amount,
      cost: this.cost
    }

    return full ? {
      ...view,
      buyer: this.buyerId.view(full),
      product: this.productId.view(full),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } : view
  }
}

orderSchema.statics = {
  index: function (page, limit, sort) {
    sort = sortQ(sort)
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)
    return this.countDocuments({})
      .then(count => this.find({}, {}, {
        skip: (page - 1) * limit,
        limit,
        sort
      })
        .then(orders => ({
          rows: orders.map(order => order.view()),
          count
        }))
      )
  }
}

const model = mongoose.model('Order', orderSchema)
model.ensureIndexes()

export const schema = model.schema
export default model
